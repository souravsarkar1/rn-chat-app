import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAllFriend } from '@/services/friend/getAllFriend';
import {
    Text,
    Avatar,
    Surface,
    Card,
    Badge,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';
import { MessageCircle, Users } from 'lucide-react-native';

interface FriendDetails {
    _id: string;
    username: string;
    fullName: string;
    profilePic: string;
    status: string;
    isOnline: boolean;
    lastSeen: string;
}

interface LastMessage {
    text: string;
    sendingTime: string;
    status: string;
}

interface Friend {
    friendDetails: FriendDetails;
    conversationId: string;
    lastMessage: LastMessage | null;
}

const Friends = () => {
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await getAllFriend();
            setAllFriends(res.friends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatLastSeen = (date: string) => {
        const lastSeen = new Date(date);
        const now = new Date();
        const diff = now.getTime() - lastSeen.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const formatLastMessage = (message: LastMessage | null) => {
        if (!message) return 'No messages yet';
        return message.text;
    };

    const renderFriendCard = ({ item }: { item: Friend }) => (
        <TouchableOpacity onPress={() => console.log('Navigate to chat:', item.conversationId)}>
            <Card style={styles.friendCard}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={60}
                            source={{ uri: item.friendDetails.profilePic }}
                        />
                        {item.friendDetails.isOnline && (
                            <Badge
                                size={12}
                                style={styles.onlineBadge}
                            />
                        )}
                    </View>
                    <View style={styles.friendInfo}>
                        <View style={styles.nameContainer}>
                            <Text variant="titleMedium" style={styles.name}>
                                {item.friendDetails.fullName}
                            </Text>
                            <Text variant="bodySmall" style={styles.timestamp}>
                                {item.friendDetails.isOnline
                                    ? 'Online'
                                    : formatLastSeen(item.friendDetails.lastSeen)}
                            </Text>
                        </View>
                        <Text variant="bodySmall" style={styles.username}>
                            @{item.friendDetails.username}
                        </Text>
                        <View style={styles.lastMessageContainer}>
                            <MessageCircle size={16} style={styles.messageIcon} />
                            <Text
                                variant="bodySmall"
                                style={styles.lastMessage}
                                numberOfLines={1}
                            >
                                {formatLastMessage(item.lastMessage)}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <Divider />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Surface style={styles.container}>
            <View style={styles.header}>
                <Users size={24} style={styles.headerIcon} />
                <Text variant="headlineSmall">Friends</Text>
                <Badge size={24} style={styles.countBadge}>
                    {allFriends.length}
                </Badge>
            </View>

            {allFriends.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text variant="titleMedium">No friends yet</Text>
                </View>
            ) : (
                <FlatList
                    data={allFriends}
                    renderItem={renderFriendCard}
                    keyExtractor={(item) => item.friendDetails._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerIcon: {
        marginRight: 12,
    },
    countBadge: {
        marginLeft: 12,
        backgroundColor: '#2196F3',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flexGrow: 1,
    },
    friendCard: {
        backgroundColor: '#fff',
        elevation: 0,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    friendInfo: {
        marginLeft: 16,
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
    },
    username: {
        color: '#666',
        marginTop: 2,
    },
    timestamp: {
        color: '#888',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    messageIcon: {
        marginRight: 4,
        color: '#666',
    },
    lastMessage: {
        color: '#666',
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default Friends;