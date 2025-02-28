import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { getAllFriend } from '@/services/friend/getAllFriend';
import { Text, Avatar, Surface, Badge, ActivityIndicator } from 'react-native-paper';
import { MessageCircle, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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

const AnimatedHeader = ({ scrollY, friendCount }: any) => {
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [120, 70],
        extrapolate: 'clamp',
    });

    const textOpacity = scrollY.interpolate({
        inputRange: [0, 60, 90],
        outputRange: [1, 0.3, 0],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
            <LinearGradient
                colors={['#3498db', '#2980b9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <Animated.Text style={[styles.headerText, { opacity: textOpacity }]}>
                        Friends
                    </Animated.Text>
                    <Animated.View style={[styles.countBadgeContainer, { opacity: textOpacity }]}>
                        <Badge style={styles.countBadge} size={24}>
                            {friendCount}
                        </Badge>
                    </Animated.View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const Friends = () => {
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollY = new Animated.Value(0);

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

    const renderFriendCard = ({ item, index }: { item: Friend; index: number }) => {
        return (
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                    type: 'timing',
                    duration: 350,
                    delay: index * 80,
                }}
            >
                <TouchableOpacity
                    style={styles.friendCard}
                    onPress={() => console.log('Navigate to chat:', item.conversationId)}
                    activeOpacity={0.7}
                >
                    <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={60}
                            source={{ uri: item.friendDetails.profilePic }}
                        />
                        {item.friendDetails.isOnline && (
                            <View style={styles.onlineIndicator} />
                        )}
                    </View>
                    <View style={styles.friendInfo}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{item.friendDetails.fullName}</Text>
                            <Text style={styles.timestamp}>
                                {item.friendDetails.isOnline ? 'Online' : formatLastSeen(item.friendDetails.lastSeen)}
                            </Text>
                        </View>
                        <Text style={styles.username}>@{item.friendDetails.username}</Text>
                        <View style={styles.lastMessageContainer}>
                            <MessageCircle size={16} color="#6B7280" />
                            <Text numberOfLines={1} style={styles.lastMessage}>
                                {formatLastMessage(item.lastMessage)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </MotiView>
        );
    };

    const renderEmptyComponent = () => (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 700 }}
            style={styles.emptyContainer}
        >
            <Users size={60} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptyDescription}>
                Add some friends to start chatting
            </Text>
        </MotiView>
    );

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <StatusBar barStyle="light-content" />
                    <View style={styles.loadingContainer}>
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing', duration: 700 }}
                            style={styles.loadingContent}
                        >
                            <ActivityIndicator size="large" color="#3498db" />
                            <Text style={styles.loadingText}>Finding your friends...</Text>
                        </MotiView>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="light-content" />

                <AnimatedHeader scrollY={scrollY} friendCount={allFriends.length} />

                <Animated.FlatList
                    data={allFriends}
                    renderItem={renderFriendCard}
                    keyExtractor={(item) => item.friendDetails._id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        width: '100%',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    headerGradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 16,
        justifyContent: 'flex-end',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    countBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    friendCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    friendInfo: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    username: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#6B7280',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default Friends;