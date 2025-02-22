import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getAllChat, sendMessage } from '@/services/chat/chatServices';
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
    const { user } = useAppSelector((state: any) => state.auth);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Initialize Socket.IO connection
    useEffect(() => {
        socket.current = io('http://localhost:3000', {
            withCredentials: true,
        });

        socket.current.emit('join_conversation', chat_room);

        socket.current.on('receive_message', (message: any) => {
            setMessages((prevMessages) => {
                const newMessages = [
                    ...prevMessages,
                    {
                        ...message,
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

    // Scroll to bottom helper
    const scrollToBottom = useCallback((animated = true) => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated });
        }
    }, [messages.length]);

    // Fetch messages
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

        fetchMessages();
    }, [chat_room, user?._id]);

    // Handle initial scroll and subsequent message updates
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
        <SafeAreaView
            style={[
                styles.container,
                { paddingTop: insets.top }
            ]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                {/* Chat Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {recipientName || 'Chat'}
                    </Text>
                </View>

                {/* Chat Messages */}
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
                    )}
                    contentContainerStyle={[
                        styles.messagesList,
                        { paddingBottom: insets.bottom + 20 }
                    ]}
                    onContentSizeChange={() => {
                        if (!isInitialLoad) {
                            scrollToBottom(false);
                        }
                    }}
                    onLayout={() => {
                        if (!isInitialLoad) {
                            scrollToBottom(false);
                        }
                    }}
                />

                {/* Typing Indicator */}
                {isTyping && (
                    <View style={styles.typingIndicator}>
                        <Text style={styles.typingText}>Typing...</Text>
                    </View>
                )}

                {/* Message Input */}
                <View style={[
                    styles.inputContainer,
                    { paddingBottom: Math.max(insets.bottom, 16) }
                ]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChangeText={handleTyping}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
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
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        elevation: 2,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    messagesList: {
        padding: 16,
        flexGrow: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4263EB',
        borderTopRightRadius: 4,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    messageText: {
        fontSize: 16,
    },
    sentMessageText: {
        color: '#FFFFFF',
    },
    receivedMessageText: {
        color: '#212529',
    },
    messageTime: {
        fontSize: 12,
        marginTop: 4,
    },
    sentMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
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
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    typingIndicator: {
        padding: 8,
        alignItems: 'flex-start',
        paddingLeft: 16,
    },
    typingText: {
        fontSize: 14,
        color: '#868E96',
        fontStyle: 'italic',
    },
});

export default SingleChatPage;