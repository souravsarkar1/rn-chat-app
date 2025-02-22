import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { getAllSuggestedFriends, sendFriendRequest } from '@/services/friend/getAllFriend';
import {
    Text,
    Card,
    Button,
    Avatar,
    Surface,
    ActivityIndicator,
} from 'react-native-paper';
import { UserPlus, Users } from 'lucide-react-native';

const Home = () => {
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingRequests, setSendingRequests] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchSuggestedFriends();
    }, []);

    const fetchSuggestedFriends = async () => {
        try {
            const res = await getAllSuggestedFriends();
            setSuggestedFriends(res?.notFriends);
        } catch (error) {
            console.error('Error fetching suggested friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (userId: string) => {
        setSendingRequests(prev => ({ ...prev, [userId]: true }));
        try {
            // Implement your add friend API call here
            // await sendFriendRequest(userId);
            // On success, you might want to refresh the list
            // await fetchSuggestedFriends();
            console.log('Friend request sent to:', userId);

            const res = await sendFriendRequest({ friendId: userId });
            console.log(res);
            setSendingRequests(prev => ({ ...prev, [userId]: false }));
            setSuggestedFriends(prev => prev.filter(id => id !== userId));
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setSendingRequests(prev => ({ ...prev, [userId]: false }));
        }
    };

    const renderFriendCard = ({ item }: any) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.userInfo}>
                    <Avatar.Image
                        size={50}
                        source={{ uri: item.profilePic }}
                        style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                        <Text variant="titleMedium" style={styles.name}>
                            {item.fullName}
                        </Text>
                        <Text variant="bodyMedium" style={styles.username}>
                            @{item.username}
                        </Text>
                        <Text variant="bodySmall" style={styles.status}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <Button
                    mode="contained"
                    onPress={() => handleAddFriend(item._id)}
                    disabled={sendingRequests[item._id]}
                    style={styles.addButton}
                    icon={() => <UserPlus size={20} color="white" />}
                >
                    {sendingRequests[item._id] ? 'Sending...' : 'Add Friend'}
                </Button>
            </Card.Content>
        </Card>
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
                <Text variant="headlineSmall">Suggested Friends</Text>
            </View>

            {suggestedFriends.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text variant="titleMedium">No suggested friends found</Text>
                </View>
            ) : (
                <FlatList
                    data={suggestedFriends}
                    renderItem={renderFriendCard}
                    keyExtractor={(item: any) => item._id}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    cardContent: {
        padding: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: '#e0e0e0',
    },
    userDetails: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
    },
    username: {
        color: '#666',
    },
    status: {
        color: '#888',
        marginTop: 4,
    },
    addButton: {
        alignSelf: 'flex-end',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default Home;