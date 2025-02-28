import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    Animated,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getAllFriend } from '@/services/friend/getAllFriend';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { format, isToday, isYesterday } from 'date-fns';

const AnimatedHeader = ({ scrollY }: { scrollY: Animated.Value }) => {
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [80, 70],
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
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <Animated.Text style={[styles.headerText, { opacity: textOpacity }]}>
                    Messages
                </Animated.Text>
            </LinearGradient>
        </Animated.View>
    );
};

const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    if (isToday(date)) {
        return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else {
        return format(date, 'MMM d');
    }
};

const ChatMain = () => {
    const [allFriend, setAllFriend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const scrollY = new Animated.Value(0);

    useEffect(() => {
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

    const filteredFriends = allFriend.filter((friend: any) =>
        friend?.friendDetails?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        friend?.friendDetails?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        friend?.lastMessage?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase())
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
                            <ActivityIndicator size="large" color="#7C3AED" />
                            <Text style={styles.loadingText}>Loading your conversations...</Text>
                        </MotiView>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    const renderSearchBar = () => (
        <Animated.View
            style={[
                styles.searchContainer,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, 50],
                                outputRange: [0, -10],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <BlurView intensity={Platform.OS === 'ios' ? 30 : 100} style={styles.searchBlur}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={searchFocused ? "#7C3AED" : "#A0A0A0"} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search conversations..."
                        placeholderTextColor="#A0A0A0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                        </TouchableOpacity>
                    )}
                </View>
            </BlurView>
        </Animated.View>
    );

    const renderItem = ({ item, index }: any) => {
        const friend = item.friendDetails;
        const message = item.lastMessage;

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
                    style={styles.chatCard}
                    onPress={() => item.conversationId && router.push(`/chat/${item.conversationId}`)}
                    activeOpacity={0.7}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: friend.profilePic }}
                            style={styles.avatar}
                        />
                        {friend.isOnline && <View style={styles.onlineIndicator} />}
                    </View>

                    <View style={styles.chatInfo}>
                        <View style={styles.chatTopRow}>
                            <Text style={styles.chatName} numberOfLines={1}>{friend.fullName}</Text>
                            <Text style={styles.chatTime}>
                                {message ? formatMessageTime(message.sendingTime) : ''}
                            </Text>
                        </View>

                        <View style={styles.chatBottomRow}>
                            <Text style={styles.chatMessage} numberOfLines={1}>
                                {message ? message.text : friend.status}
                            </Text>

                            {message && message.status === 'sent' && (
                                <View style={styles.messageStatus}>
                                    <Ionicons name="checkmark" size={16} color="#A0A0A0" />
                                </View>
                            )}
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
            <Ionicons name="search" size={60} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyDescription}>
                We couldn't find any conversations matching "{searchQuery}"
            </Text>
        </MotiView>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="light-content" />

                <AnimatedHeader scrollY={scrollY} />
                {renderSearchBar()}

                <Animated.FlatList
                    data={filteredFriends}
                    keyExtractor={(item: any) => item.friendDetails._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
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
    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
        zIndex: 10,
    },
    searchBlur: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1F2937',
        borderRadius: 5
    },
    list: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    chatCard: {
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
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    chatTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    chatBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatMessage: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    messageStatus: {
        marginLeft: 4,
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

export default ChatMain;