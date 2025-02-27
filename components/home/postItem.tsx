"use client"

import { useRef, useEffect, useCallback } from "react"
import { View, Text, Image, StyleSheet, Pressable, Animated, Dimensions } from "react-native"
import { ArrowUp, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react-native"
import { createBounceAnimation, createPulseAnimation } from "../animations/animatiions"

const { width } = Dimensions.get("window")

interface PostProps {
    post: any
    index: number
}

const PostItem = ({ post, index }: PostProps) => {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(50)).current
    const likeScale = useRef(new Animated.Value(1)).current
    const buttonScale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // Start entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100, // Stagger the animations
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start()
    }, [fadeAnim, index, translateY])

    // Generate a random color for the avatar based on the author name
    const getAvatarColor = (name: string) => {
        const colors = ["#FF4500", "#0079D3", "#1E88E5", "#43A047", "#E53935", "#8E24AA", "#FFB300"]
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    // Get initials from author name
    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase()
    }

    const handleLikePress = useCallback(() => {
        // createPulseAnimation(likeScale).start()
    }, [likeScale])

    const handleButtonPress = useCallback(() => {
        // createBounceAnimation(buttonScale).start()
    }, [buttonScale])

    return (
        <Animated.View
            style={[
                styles.postContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                },
            ]}
        >
            <View style={styles.headerContainer}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(post.data.author) }]}>
                    <Text style={styles.avatarText}>{getInitials(post.data.author)}</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.author}>{post.data.author}</Text>
                    <Text style={styles.timestamp}>{new Date(post.data.created * 1000).toLocaleDateString()}</Text>
                </View>
                <Pressable style={styles.moreButton} onPress={handleButtonPress}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <MoreHorizontal width={18} height={18} color="#787C7E" />
                    </Animated.View>
                </Pressable>
            </View>

            <Text style={styles.title}>{post.data.title}</Text>

            {post.data.url && post.data.url.match(/\.(jpeg|jpg|gif|png)$/) && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: post.data.url }} style={styles.image} resizeMode="cover" />
                </View>
            )}

            <View style={styles.statsContainer}>
                <Pressable style={styles.statItem} onPress={handleLikePress}>
                    <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                        <ArrowUp width={16} height={16} color="#FF4500" />
                    </Animated.View>
                    <Text style={styles.statText}>{post.data.score}</Text>
                </Pressable>
                <Pressable style={styles.statItem} onPress={handleButtonPress}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <MessageCircle width={16} height={16} color="#787C7E" />
                    </Animated.View>
                    <Text style={styles.statText}>{post.data.num_comments}</Text>
                </Pressable>
                <Pressable style={styles.statItem} onPress={handleButtonPress}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <Share2 width={16} height={16} color="#787C7E" />
                    </Animated.View>
                    <Text style={styles.statText}>Share</Text>
                </Pressable>
                <Pressable style={[styles.statItem, styles.bookmarkButton]} onPress={handleButtonPress}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <Bookmark width={16} height={16} color="#787C7E" />
                    </Animated.View>
                </Pressable>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
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
})

export default PostItem

