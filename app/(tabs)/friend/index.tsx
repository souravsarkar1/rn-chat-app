import { View, FlatList, StyleSheet, Animated, RefreshControl } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import { getAllFriendRequst, getAllSuggestedFriends, sendFriendRequest } from '@/services/friend/getAllFriend';
import {
    Text,
    Card,
    Button,
    Avatar,
    Surface,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';
import { UserPlus, Users, RefreshCw, UserCheck, Clock } from 'lucide-react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const windowWidth = Dimensions.get('window').width;

const Home = () => {
    // Original state variables - preserving existing logic
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sendingRequests, setSendingRequests] = useState<{ [key: string]: boolean }>({});
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);

    // Tab navigation state - new addition for swipeable UI
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'suggested', title: 'Suggested' },
        { key: 'requests', title: 'Requests' },
        { key: 'sent', title: 'Sent' },
    ]);

    // Animation values - preserving existing animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Keeping your original data fetching logic
        fetchSuggestedFriends();
        fetchFriendRequest();

        // Fade in animation when component mounts
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Preserving your original methods
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

    const fetchFriendRequest = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            const res = await getAllFriendRequst();
            console.log(res);
            // Using the sample data you provided
            setFriendRequests(res.data);
            // Sent requests will be empty
            setSentRequests([]);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSuggestedFriends(true);
        fetchFriendRequest(true);
    };

    // Keeping your original add friend logic
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

    // Add handlers for friend requests - minimal implementation
    const handleAcceptRequest = (userId: string) => {
        const updatedRequests = friendRequests.filter((request: any) => request._id !== userId);
        setFriendRequests(updatedRequests);
        // Here you would add API call to accept request
    };

    const handleRejectRequest = (userId: string) => {
        const updatedRequests = friendRequests.filter((request: any) => request._id !== userId);
        setFriendRequests(updatedRequests);
        // Here you would add API call to reject request
    };

    // Maintaining your original render function for suggested friends
    const renderSuggestedFriendCard = ({ item, index }: any) => {
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
                            //@ts-ignore
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

    // Render function for friend requests - similar styling to original card
    const renderRequestCard = ({ item, index }: any) => {
        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        opacity: fadeAnim,
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
                        <View style={styles.actionButtons}>
                            <Button
                                mode="contained"
                                onPress={() => handleAcceptRequest(item._id)}
                                style={styles.acceptButton}
                                icon={() => <UserCheck size={18} color="white" />}
                                labelStyle={styles.buttonLabel}
                            >
                                Accept
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => handleRejectRequest(item._id)}
                                style={styles.rejectButton}
                                labelStyle={[styles.buttonLabel, { color: '#6200EE' }]}
                            >
                                Decline
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </Animated.View>
        );
    };

    // Render function for sent requests - empty state for now
    const renderSentRequestCard = ({ item, index }: any) => {
        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        opacity: fadeAnim,
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
                                    Request sent
                                </Text>
                            </View>
                        </View>
                        <Divider style={styles.divider} />
                        <Button
                            mode="outlined"
                            style={styles.cancelButton}
                            labelStyle={[styles.buttonLabel, { color: '#FF5252' }]}
                        >
                            Cancel
                        </Button>
                    </Card.Content>
                </Card>
            </Animated.View>
        );
    };

    // Maintaining your original empty state render
    const renderEmptyState = (message: any, subMessage: any, refreshAction: any) => (
        <Animated.View
            style={[styles.emptyContainer, { opacity: fadeAnim }]}
        >
            <Text variant="titleLarge" style={styles.emptyText}>
                {message}
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
                {subMessage}
            </Text>
            <Button
                mode="outlined"
                onPress={refreshAction}
                style={styles.refreshButton}
                icon={() => <RefreshCw size={20} color="#6200EE" />}
            >
                Refresh
            </Button>
        </Animated.View>
    );

    // Tab scene functions - keeping original components and logic
    const SuggestedRoute = () => (
        suggestedFriends.length === 0 ?
            renderEmptyState(
                "No suggested friends found",
                "We'll notify you when we find people you might know",
                () => fetchSuggestedFriends()
            ) :
            <AnimatedFlatList
                data={suggestedFriends}
                renderItem={renderSuggestedFriendCard}
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
    );

    const RequestsRoute = () => (
        friendRequests.length === 0 ?
            renderEmptyState(
                "No friend requests",
                "When someone adds you, you'll see their request here",
                () => fetchFriendRequest()
            ) :
            <AnimatedFlatList
                data={friendRequests}
                renderItem={renderRequestCard}
                keyExtractor={(item: any) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#6200EE']}
                        tintColor="#6200EE"
                    />
                }
            />
    );

    const SentRoute = () => (
        renderEmptyState(
            "No sent requests",
            "Requests you've sent will appear here",
            () => fetchFriendRequest()
        )
    );

    // Header animation from your original code
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

    // Maintaining your loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text style={styles.loadingText}>Loading suggested friends...</Text>
            </View>
        );
    }

    // Scene map for TabView
    const renderScene = SceneMap({
        suggested: SuggestedRoute,
        requests: RequestsRoute,
        sent: SentRoute,
    });

    // Render tab bar with notification badges
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#6200EE' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ color: '#6200EE', fontWeight: 'bold' }}
            activeColor="#6200EE"
            inactiveColor="#888"
            renderIcon={({ route, focused, color }: any) => {
                let icon;
                if (route.key === 'suggested') {
                    icon = <Users size={20} color={color} />;
                } else if (route.key === 'requests') {
                    icon = <UserPlus size={20} color={color} />;
                } else if (route.key === 'sent') {
                    icon = <Clock size={20} color={color} />;
                }
                return icon;
            }}
            renderLabel={({ route, focused, color }: any) => (
                <Text style={{ color, fontSize: 12, fontWeight: focused ? 'bold' : 'normal' }}>
                    {route.title}
                    {route.key === 'requests' && friendRequests.length > 0 ?
                        <Text style={{ color: '#FF5252', fontWeight: 'bold' }}> ({friendRequests.length})</Text>
                        : null
                    }
                </Text>
            )}
        />
    );

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
                    Connect with Friends
                </Text>
            </Animated.View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: windowWidth }}
                renderTabBar={renderTabBar}
                swipeEnabled={true}
            />
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
    acceptButton: {
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#6200EE',
        flex: 1,
        marginRight: 8,
    },
    rejectButton: {
        borderRadius: 12,
        paddingHorizontal: 12,
        borderColor: '#6200EE',
        flex: 1,
        marginLeft: 8,
    },
    cancelButton: {
        alignSelf: 'flex-end',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderColor: '#FF5252',
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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