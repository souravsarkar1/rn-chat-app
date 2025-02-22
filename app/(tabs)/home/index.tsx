import { View, Text, SafeAreaView, Image, ActivityIndicator, RefreshControl, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { homeContent } from '@/services/entertentment/entertentment';

const Home = () => {
    const [posts, setPosts] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    const fetchPosts = async (isRefresh = false) => {
        try {
            setLoading(true);
            const res = await homeContent({ limit: 20 });
            const newPosts = res.data.children;

            if (isRefresh) {
                setPosts(newPosts);
                setPage(1);
            } else {
                setPosts((prev: any) => [...prev, ...newPosts]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts(true);
    }, []);

    //@ts-ignore
    const renderPost = ({ item: post }) => (
        <View style={styles.postContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.headerText}>
                    <Text style={styles.author}>{post.data.author}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(post.data.created * 1000).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <Text style={styles.title}>{post.data.title}</Text>

            {post.data.url && post.data.url.match(/\.(jpeg|jpg|gif|png)$/) && (
                <Image
                    source={{ uri: post.data.url }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statText}>↑ {post.data.score}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statText}>💬 {post.data.num_comments}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statText}>↗ Share</Text>
                </View>
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF4500" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!loading) {
            fetchPosts();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item, index) => `${item.data.id}-${index}`}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FF4500"]}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3F5',
        padding: 10
    },
    postContainer: {
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DDD',
    },
    headerText: {
        marginLeft: 8,
    },
    author: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    timestamp: {
        fontSize: 12,
        color: '#787C7E',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1C1C1C',
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    image: {
        width: '100%',
        height: 300,
        backgroundColor: '#F2F3F5',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    statText: {
        fontSize: 14,
        color: '#787C7E',
    },
    loaderContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default Home;