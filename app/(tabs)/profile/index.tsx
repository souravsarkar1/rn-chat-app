import { View, ScrollView, StyleSheet, TouchableOpacity, Animated, ImageBackground, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { getMe } from '@/services/friend/getAllFriend';
import {
    Avatar,
    Text,
    Card,
    Button,
    Portal,
    Modal,
    TextInput,
    useTheme,
    Divider,
    IconButton,
} from 'react-native-paper';
import {
    User,
    Mail,
    Users,
    Clock,
    Edit,
    Camera,
    MessageCircle,
    Settings,
    Calendar,
    ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Profile = () => {
    const [me, setMe] = useState<any>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        status: '',
    });
    const theme = useTheme();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        (async () => {
            const res = await getMe();
            setMe(res?.data);
            setEditForm({
                fullName: res?.data?.fullName,
                status: res?.data?.status,
            });
        })();
    }, []);

    useEffect(() => {
        if (me) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(cardAnim, {
                    toValue: 0,
                    duration: 700,
                    delay: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [me]);

    const handleEdit = () => {
        setMe({
            //@ts-ignore
            ...me,
            fullName: editForm.fullName,
            status: editForm.status,
        });
        setEditModalVisible(false);
    };

    if (!me) {
        return (
            <View style={styles.loadingContainer}>
                <Text variant="headlineMedium">Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar style="light" />

            {/* Header Background with Gradient */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070' }}
                style={styles.headerBackground}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                />
                <View style={styles.headerTopRow}>
                    <IconButton
                        icon="arrow-left"
                        iconColor="white"
                        size={26}
                        onPress={() => router.back()}
                    />
                    <IconButton
                        icon={() => <Settings size={24} color="white" />}
                        size={26}
                        onPress={() => { }}
                    />
                </View>
            </ImageBackground>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Profile Card Overlapping Header */}
                <Animated.View
                    style={[
                        styles.profileCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Avatar.Image
                                size={100}
                                source={{ uri: me.profilePic }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Camera size={18} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text variant="headlineSmall" style={styles.name}>
                                {me.fullName}
                            </Text>
                            <Text variant="bodyMedium" style={styles.username}>
                                @{me.username}
                            </Text>

                            <View style={styles.statsRow}>
                                <View style={styles.stat}>
                                    <Text variant="titleLarge" style={styles.statNumber}>
                                        {me.friends?.length || 0}
                                    </Text>
                                    <Text variant="bodySmall" style={styles.statLabel}>
                                        Friends
                                    </Text>
                                </View>

                                <View style={styles.statDivider} />

                                <View style={styles.stat}>
                                    <Text variant="titleLarge" style={styles.statNumber}>
                                        42
                                    </Text>
                                    <Text variant="bodySmall" style={styles.statLabel}>
                                        Posts
                                    </Text>
                                </View>

                                <View style={styles.statDivider} />

                                <View style={styles.stat}>
                                    <Text variant="titleLarge" style={styles.statNumber}>
                                        128
                                    </Text>
                                    <Text variant="bodySmall" style={styles.statLabel}>
                                        Likes
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.statusSection}>
                        <View style={styles.statusHeader}>
                            <MessageCircle size={20} color={theme.colors.primary} />
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Status
                            </Text>
                        </View>
                        <Text variant="bodyMedium" style={styles.statusText}>
                            {me.status || "Hey there! I'm using this app."}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => setEditModalVisible(true)}
                        style={styles.editButton}
                        icon={() => <Edit size={18} color="white" />}
                    >
                        Edit Profile
                    </Button>
                </Animated.View>

                {/* Content Cards */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: cardAnim }]
                    }}
                >
                    {/* Personal Info Card */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.cardTitle}>
                                Personal Information
                            </Text>

                            <TouchableOpacity style={styles.infoItem}>
                                <View style={styles.infoItemIcon}>
                                    <Mail size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.infoItemContent}>
                                    <Text variant="bodySmall" style={styles.infoItemLabel}>
                                        Email
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.infoItemValue}>
                                        {me.email}
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#ccc" />
                            </TouchableOpacity>

                            <Divider style={styles.itemDivider} />

                            <TouchableOpacity
                                style={styles.infoItem}
                                onPress={() => router.push("/profile/friends")}
                            >
                                <View style={styles.infoItemIcon}>
                                    <Users size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.infoItemContent}>
                                    <Text variant="bodySmall" style={styles.infoItemLabel}>
                                        Friends
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.infoItemValue}>
                                        {me.friends?.length || 0} connections
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#ccc" />
                            </TouchableOpacity>

                            <Divider style={styles.itemDivider} />

                            <TouchableOpacity style={styles.infoItem}>
                                <View style={styles.infoItemIcon}>
                                    <Calendar size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.infoItemContent}>
                                    <Text variant="bodySmall" style={styles.infoItemLabel}>
                                        Joined
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.infoItemValue}>
                                        January 2023
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#ccc" />
                            </TouchableOpacity>

                            <Divider style={styles.itemDivider} />

                            <TouchableOpacity style={styles.infoItem}>
                                <View style={styles.infoItemIcon}>
                                    <Clock size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.infoItemContent}>
                                    <Text variant="bodySmall" style={styles.infoItemLabel}>
                                        Last Active
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.infoItemValue}>
                                        {new Date(me.lastSeen).toLocaleString()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.cardTitle}>
                                Recent Activity
                            </Text>

                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <View style={styles.activityContent}>
                                    <Text variant="bodyMedium">
                                        You updated your profile picture
                                    </Text>
                                    <Text variant="bodySmall" style={styles.activityTime}>
                                        2 days ago
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <View style={styles.activityContent}>
                                    <Text variant="bodyMedium">
                                        You connected with Jane Smith
                                    </Text>
                                    <Text variant="bodySmall" style={styles.activityTime}>
                                        5 days ago
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <View style={styles.activityContent}>
                                    <Text variant="bodyMedium">
                                        You created a new post
                                    </Text>
                                    <Text variant="bodySmall" style={styles.activityTime}>
                                        1 week ago
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </Animated.View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Portal>
                <Modal
                    visible={editModalVisible}
                    onDismiss={() => setEditModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text variant="titleLarge" style={styles.modalTitle}>
                        Edit Profile
                    </Text>

                    <Text variant="labelLarge" style={styles.inputLabel}>
                        Full Name
                    </Text>
                    <TextInput
                        value={editForm.fullName}
                        onChangeText={(text) =>
                            setEditForm({ ...editForm, fullName: text })
                        }
                        style={styles.input}
                        mode="outlined"
                    />

                    <Text variant="labelLarge" style={styles.inputLabel}>
                        Status
                    </Text>
                    <TextInput
                        value={editForm.status}
                        onChangeText={(text) =>
                            setEditForm({ ...editForm, status: text })
                        }
                        style={styles.input}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.modalButtons}>
                        <Button
                            mode="outlined"
                            onPress={() => setEditModalVisible(false)}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleEdit}
                            style={styles.saveButton}
                        >
                            Save Changes
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f8fa',
    },
    headerBackground: {
        height: 220,
        width: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 220,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    container: {
        flex: 1,
        marginTop: -100,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f8fa',
    },
    profileCard: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 20,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: 'white',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 18,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontWeight: 'bold',
    },
    username: {
        color: '#666',
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontWeight: 'bold',
        // color: theme.colors.primary,
    },
    statLabel: {
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#e0e0e0',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#e0e0e0',
    },
    statusSection: {
        marginBottom: 16,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    statusText: {
        paddingLeft: 28,
        lineHeight: 22,
    },
    editButton: {
        borderRadius: 12,
        marginTop: 8,
    },
    card: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        // color: theme.colors.primary,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoItemIcon: {
        width: 40,
        alignItems: 'center',
    },
    infoItemContent: {
        flex: 1,
    },
    infoItemLabel: {
        color: '#666',
        marginBottom: 2,
    },
    infoItemValue: {
        fontWeight: '500',
    },
    itemDivider: {
        backgroundColor: '#f0f0f0',
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    activityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        // backgroundColor: theme.colors.primary,
        marginRight: 12,
        marginTop: 6,
    },
    activityContent: {
        flex: 1,
    },
    activityTime: {
        color: '#888',
        marginTop: 4,
    },
    modalContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        padding: 24,
        elevation: 5,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    inputLabel: {
        marginBottom: 8,
        color: '#555',
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        borderRadius: 12,
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 12,
    },
});

export default Profile;