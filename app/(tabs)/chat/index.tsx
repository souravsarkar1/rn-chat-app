import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getAllFriend } from '@/services/friend/getAllFriend';
import { router } from 'expo-router';

const ChatMain = () => {
    const [allFriend, setAllFriend] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    React.useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await getAllFriend();
                setAllFriend(res.friends);
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    // Filter friends based on search query
    const filteredFriends = allFriend.filter((friend) =>
        friend?.friendDetails?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        friend?.friendDetails?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        friend?.friendDetails?.lastMessage?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Chats</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}

                    />
                </View>
                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item.friendDetails._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => item.conversationId && router.push(`/chat/${item.conversationId}` as any)}>

                            <View style={styles.friendItem}>
                                <Image
                                    source={{ uri: item.friendDetails.profilePic }}
                                    style={styles.profilePic}
                                />
                                <View style={styles.friendInfo}>
                                    <Text style={styles.friendName}>{item.friendDetails.fullName}</Text>
                                    <Text style={styles.friendStatus}>
                                        {item.lastMessage ? item.lastMessage.text : item.friendDetails.status}
                                    </Text>
                                </View>
                                {item.friendDetails.isOnline && <View style={styles.onlineIndicator} />}
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No friends found</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    friendStatus: {
        fontSize: 14,
        color: '#666',
    },
    onlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ChatMain;