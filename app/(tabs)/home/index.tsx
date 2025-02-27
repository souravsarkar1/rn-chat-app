"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
    View,
    Text,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
} from "react-native"
import { homeContent } from "@/services/entertentment/entertentment"
import { TrendingUp } from "lucide-react-native"
import PostItem from "@/components/home/postItem"

// Get screen dimensions
const { width } = Dimensions.get("window")

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const Home = () => {
    const [posts, setPosts] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [page, setPage] = useState(1)

    // Animation values
    const scrollY = useRef(new Animated.Value(0)).current
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0.9],
        extrapolate: "clamp",
    })

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -10],
        extrapolate: "clamp",
    })

    const fetchPosts = useCallback(async (isRefresh = false) => {
        try {
            setLoading(true)
            const res = await homeContent({ limit: 20 })
            const newPosts = res.data.children

            if (isRefresh) {
                setPosts(newPosts)
                setPage(1)
            } else {
                setPosts((prev: any) => [...prev, ...newPosts])
                setPage((prev) => prev + 1)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchPosts(true)
    }, [fetchPosts])

    const renderPost = ({ item: post, index }: { item: any; index: number }) => {
        return <PostItem post={post} index={index} />
    }

    const renderHeader = () => (
        <Animated.View
            style={[
                styles.header,
                {
                    opacity: headerOpacity,
                    transform: [{ translateY: headerTranslate }],
                },
            ]}
        >
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Vive Feed</Text>
                <View style={styles.headerRight}>
                    <Pressable style={styles.headerButton}>
                        <TrendingUp width={20} height={20} color="#FF4500" />
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    )

    const renderFooter = () => {
        if (!loading) return null
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF4500" />
            </View>
        )
    }

    const renderEmpty = () => {
        if (loading && posts.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    {[...Array(3)].map((_, index) => (
                        <View key={index} style={styles.skeletonPost}>
                            <View style={styles.skeletonHeader}>
                                <View style={styles.skeletonAvatar} />
                                <View style={styles.skeletonHeaderText}>
                                    <View style={styles.skeletonAuthor} />
                                    <View style={styles.skeletonTimestamp} />
                                </View>
                            </View>
                            <View style={styles.skeletonTitle} />
                            <View style={styles.skeletonImage} />
                            <View style={styles.skeletonStats} />
                        </View>
                    ))}
                </View>
            )
        }
        return null
    }

    const handleLoadMore = () => {
        if (!loading) {
            fetchPosts()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            {renderHeader()}
            <AnimatedFlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item: any, index) => `${item.data.id}-${index}`}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FF4500"]}
                        progressBackgroundColor="#FFFFFF"
                        tintColor="#FF4500"
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F3F5",
    },
    header: {
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E6E6E6",
        zIndex: 10,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FF4500",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerButton: {
        padding: 8,
    },
    listContent: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 20,
    },
    postContainer: {
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
    },
    headerText: {
        flex: 1,
        marginLeft: 10,
    },
    author: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1C1C1C",
    },
    timestamp: {
        fontSize: 12,
        color: "#787C7E",
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1C1C1C",
        paddingHorizontal: 12,
        paddingBottom: 12,
        lineHeight: 22,
    },
    imageContainer: {
        width: "100%",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: width * 0.75,
        backgroundColor: "#F2F3F5",
    },
    statsContainer: {
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#E6E6E6",
        alignItems: "center",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    statText: {
        fontSize: 14,
        color: "#787C7E",
        marginLeft: 6,
        fontWeight: "500",
    },
    bookmarkButton: {
        marginLeft: "auto",
        marginRight: 0,
    },
    loaderContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    emptyContainer: {
        padding: 12,
    },
    skeletonPost: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
    },
    skeletonHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    skeletonAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E6E6E6",
    },
    skeletonHeaderText: {
        marginLeft: 10,
    },
    skeletonAuthor: {
        width: 120,
        height: 14,
        backgroundColor: "#E6E6E6",
        borderRadius: 4,
        marginBottom: 6,
    },
    skeletonTimestamp: {
        width: 80,
        height: 10,
        backgroundColor: "#E6E6E6",
        borderRadius: 4,
    },
    skeletonTitle: {
        height: 16,
        backgroundColor: "#E6E6E6",
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonImage: {
        width: "100%",
        height: 200,
        backgroundColor: "#E6E6E6",
        borderRadius: 8,
        marginBottom: 12,
    },
    skeletonStats: {
        height: 30,
        backgroundColor: "#E6E6E6",
        borderRadius: 4,
    },
})

export default Home

