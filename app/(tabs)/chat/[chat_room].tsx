import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getAllChat, getChatFriend, sendMessage } from '@/services/chat/chatServices';
import { formatTime } from '@/helpers/timeformat';
import io from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SingleChatPage = () => {
    const insets = useSafeAreaInsets();
    const { chat_room, recipientName } = useLocalSearchParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const socket = useRef<any>(null);
    const [friendDetails, setFriendDetails] = useState<any>(null);
    const { user } = useAppSelector((state: any) => state.auth);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        socket.current = io('http://http://192.168.0.106:3000:3000', {
            withCredentials: true,
        });

        socket.current.emit('join_conversation', chat_room);

        socket.current.on('receive_message', (message: any) => {
            setMessages((prevMessages) => {
                const newMessages = [
                    ...prevMessages,
                    {
                        ...message,
                        text: message?.content,
                        sender: message.sender === user?._id ? 'You' : 'other',
                        sendingTime: new Date().toISOString(),
                    },
                ];
                setTimeout(() => scrollToBottom(false), 100);
                return newMessages;
            });
        });

        socket.current.on('user_typing', () => setIsTyping(true));
        socket.current.on('user_stop_typing', () => setIsTyping(false));

        return () => {
            socket.current.emit('leave_conversation', chat_room);
            socket.current.disconnect();
        };
    }, [chat_room, user?._id]);

    const scrollToBottom = useCallback((animated = true) => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated });
        }
    }, [messages.length]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getAllChat({ conversationId: chat_room });
                const updatedMessages = res.data.map((item: any) => ({
                    ...item,
                    sender: item.sender === user?._id ? 'You' : 'other',
                }));
                setMessages(updatedMessages);
                setIsInitialLoad(true);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchFriend = async () => {
            try {
                const res = await getChatFriend({ userId: user?._id, conversationId: chat_room });
                setFriendDetails(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMessages();
        fetchFriend();
    }, [chat_room, user?._id]);

    useEffect(() => {
        if (isInitialLoad && messages.length > 0) {
            setTimeout(() => {
                scrollToBottom(false);
                setIsInitialLoad(false);
            }, 100);
        }
    }, [messages, isInitialLoad, scrollToBottom]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const payload = {
            conversationId: chat_room,
            content: newMessage.trim(),
            messageType: 'text',
            sendingTime: new Date().toISOString(),
        };

        try {
            const res = await sendMessage(payload);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...res.data,
                    sender: 'You',
                    sendingTime: new Date().toISOString(),
                },
            ]);
            setNewMessage('');
            scrollToBottom(true);

            socket.current.emit('send_message', {
                conversationId: chat_room,
                message: {
                    ...payload,
                    sender: 'You',
                },
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (text: string) => {
        setNewMessage(text);
        if (text.trim()) {
            socket.current.emit('typing', { conversationId: chat_room });
        } else {
            socket.current.emit('stop_typing', { conversationId: chat_room });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image
                            source={{ uri: friendDetails?.profilePic }}
                            style={styles.profilePic}
                        />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}>
                                {friendDetails?.fullName}
                            </Text>
                            <Text style={styles.statusText}>
                                {isTyping ? 'Typing...' : friendDetails?.status}
                            </Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageContainer,
                                item.sender === 'You' ? styles.sentMessage : styles.receivedMessage,
                            ]}
                        >
                            <View style={styles.messageContent}>
                                <Text style={[
                                    styles.messageText,
                                    item.sender === 'You' ? styles.sentMessageText : styles.receivedMessageText
                                ]}>
                                    {item.text}
                                </Text>
                                <Text style={[
                                    styles.messageTime,
                                    item.sender === 'You' ? styles.sentMessageTime : styles.receivedMessageTime
                                ]}>
                                    {formatTime(item.sendingTime)}
                                </Text>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={[styles.messagesList, { paddingBottom: insets.bottom + 20 }]}
                    onContentSizeChange={() => !isInitialLoad && scrollToBottom(false)}
                    onLayout={() => !isInitialLoad && scrollToBottom(false)}
                />

                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChangeText={handleTyping}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        color: '#868E96',
        marginTop: 2,
    },
    messagesList: {
        padding: 16,
        flexGrow: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
    },
    messageContent: {
        padding: 12,
        borderRadius: 16,
    },
    sentMessage: {
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
    },
    sentMessageText: {
        color: '#FFFFFF',
        backgroundColor: '#4263EB',
        padding: 12,
        borderRadius: 16,
        borderTopRightRadius: 4,
    },
    receivedMessageText: {
        color: '#212529',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    sentMessageTime: {
        color: '#868E96',
    },
    receivedMessageTime: {
        color: '#868E96',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        marginRight: 12,
        fontSize: 16,
        color: '#212529',
        maxHeight: 100,
    },
    sendButton: {
        padding: 12,
        backgroundColor: '#4263EB',
        borderRadius: 24,
        minWidth: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#CED4DA',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SingleChatPage;