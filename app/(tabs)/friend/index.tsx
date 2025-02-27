import { View, FlatList, StyleSheet, Animated, RefreshControl } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import { getAllSuggestedFriends, sendFriendRequest } from '@/services/friend/getAllFriend';
import {
    Text,
    Card,
    Button,
    Avatar,
    Surface,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';
import { UserPlus, Users, RefreshCw } from 'lucide-react-native';

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Home = () => {
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sendingRequests, setSendingRequests] = useState<{ [key: string]: boolean }>({});

    // Animation values
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fetchSuggestedFriends();

        // Fade in animation when component mounts
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const fetchSuggestedFriends = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            const res = await getAllSuggestedFriends();
            setSuggestedFriends(res?.notFriends || []);
        } catch (error) {
            console.error('Error fetching suggested friends:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSuggestedFriends(true);
    };

    const handleAddFriend = async (userId: string) => {
        setSendingRequests(prev => ({ ...prev, [userId]: true }));
        try {
            const res = await sendFriendRequest({ friendId: userId });
            console.log(res);

            // Animate the removal of the card
            const filteredFriends = suggestedFriends.filter((friend: any) => friend._id !== userId);
            setSuggestedFriends(filteredFriends);
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setSendingRequests(prev => ({ ...prev, [userId]: false }));
        }
    };

    const renderFriendCard = ({ item, index }: any) => {
        // Animation calculations
        const inputRange = [
            -1,
            0,
            (index * 150),
            (index + 2) * 150
        ];

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.9],
            extrapolate: 'clamp'
        });

        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0.7],
            extrapolate: 'clamp'
        });

        const translateX = scrollY.interpolate({
            inputRange,
            outputRange: [0, 0, 0, -10],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale },
                            { translateX }
                        ]
                    }
                ]}
            >
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.userInfo}>
                            <Avatar.Image
                                size={60}
                                source={{ uri: item.profilePic }}
                                style={styles.avatar}
                            />
                            <View style={styles.userDetails}>
                                <Text variant="titleLarge" style={styles.name}>
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
                        <Divider style={styles.divider} />
                        <Button
                            mode="contained"
                            onPress={() => handleAddFriend(item._id)}
                            disabled={sendingRequests[item._id]}
                            style={styles.addButton}
                            icon={() => <UserPlus size={18} color="white" />}
                            labelStyle={styles.buttonLabel}
                        >
                            {sendingRequests[item._id] ? 'Sending...' : 'Add Friend'}
                        </Button>
                    </Card.Content>
                </Card>
            </Animated.View>
        );
    };

    // Header animation
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -5],
        extrapolate: 'clamp'
    });

    const headerScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.98],
        extrapolate: 'clamp'
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.loadingText}>Loading suggested friends...</Text>
            </View>
        );
    }

    return (
        <Surface style={styles.container}>
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        transform: [
                            { translateY: headerTranslateY },
                            { scale: headerScale }
                        ]
                    }
                ]}
            >
                <Users size={28} color="#6200EE" style={styles.headerIcon} />
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Suggested Friends
                </Text>
            </Animated.View>

            {suggestedFriends.length === 0 ? (
                <Animated.View
                    style={[styles.emptyContainer, { opacity: fadeAnim }]}
                >
                    <Text variant="titleLarge" style={styles.emptyText}>
                        No suggested friends found
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptySubtext}>
                        We'll notify you when we find people you might know
                    </Text>
                    <Button
                        mode="outlined"
                        onPress={() => fetchSuggestedFriends()}
                        style={styles.refreshButton}
                        icon={() => <RefreshCw size={20} color="#6200EE" />}
                    >
                        Refresh
                    </Button>
                </Animated.View>
            ) : (
                <AnimatedFlatList
                    data={suggestedFriends}
                    renderItem={renderFriendCard}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6200EE']}
                            tintColor="#6200EE"
                        />
                    }
                />
            )}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8fc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 24,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 8,
    },
    headerIcon: {
        marginRight: 16,
    },
    headerTitle: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#6200EE',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8fc',
    },
    loadingText: {
        marginTop: 12,
        color: '#6200EE',
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
        paddingTop: 8,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: '#e0e0e0',
        borderWidth: 2,
        borderColor: '#6200EE20',
    },
    userDetails: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    username: {
        color: '#666',
        marginBottom: 2,
    },
    status: {
        color: '#888',
        marginTop: 2,
    },
    divider: {
        marginVertical: 12,
        backgroundColor: '#6200EE20',
    },
    addButton: {
        alignSelf: 'flex-end',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#6200EE',
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#6200EE',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
    },
    refreshButton: {
        borderColor: '#6200EE',
        borderRadius: 12,
    },
});

export default Home;