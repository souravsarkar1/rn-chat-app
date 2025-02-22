import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMe } from '@/services/friend/getAllFriend';
import {
    Avatar,
    Text,
    Card,
    Button,
    Surface,
    Portal,
    Modal,
    TextInput,
    useTheme,
} from 'react-native-paper';
import {
    User,
    Mail,
    Users,
    Clock,
    Edit,
    Camera,
    AtSign,
    MessageCircle,
} from 'lucide-react-native';
import { router } from 'expo-router';

const Profile = () => {
    const [me, setMe] = useState<any>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        status: '',
    });
    const theme = useTheme();

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

    const handleEdit = () => {
        // Implement your edit logic here
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
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <Surface style={styles.header} elevation={2}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image
                            size={120}
                            source={{ uri: me.profilePic }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <Text variant="headlineMedium" style={styles.name}>
                        {me.fullName}
                    </Text>
                    <Text variant="titleMedium" style={styles.username}>
                        @{me.username}
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => setEditModalVisible(true)}
                        style={styles.editButton}
                        icon={() => <Edit size={20} color="white" />}
                    >
                        Edit Profile
                    </Button>
                </View>
            </Surface>

            {/* Status Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Status"
                    left={(props) => <MessageCircle {...props} />}
                />
                <Card.Content>
                    <Text variant="bodyLarge">{me.status}</Text>
                </Card.Content>
            </Card>

            {/* User Info Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Personal Information"
                    left={(props) => <User {...props} />}
                />
                <Card.Content>
                    <View style={styles.infoRow}>
                        <Mail size={20} color={theme.colors.primary} />
                        <Text variant="bodyLarge" style={styles.infoText}>
                            {me.email}
                        </Text>
                    </View>


                    <TouchableOpacity style={styles.infoRow} onPress={() => router.push("/profile/friends")}>
                        <Users size={20} color={theme.colors.primary} />
                        <Text variant="bodyLarge" style={styles.infoText}>
                            {me.friends?.length || 0} Friends
                        </Text>
                    </TouchableOpacity>
                    {/* </View> */}
                    <View style={styles.infoRow}>
                        <Clock size={20} color={theme.colors.primary} />
                        <Text variant="bodyLarge" style={styles.infoText}>
                            Last seen: {new Date(me.lastSeen).toLocaleString()}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Edit Profile Modal */}
            <Portal>
                <Modal
                    visible={editModalVisible}
                    onDismiss={() => setEditModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text variant="headlineSmall" style={styles.modalTitle}>
                        Edit Profile
                    </Text>
                    <TextInput
                        label="Full Name"
                        value={editForm.fullName}
                        onChangeText={(text) =>
                            setEditForm({ ...editForm, fullName: text })
                        }
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Status"
                        value={editForm.status}
                        onChangeText={(text) =>
                            setEditForm({ ...editForm, status: text })
                        }
                        style={styles.input}
                        mode="outlined"
                        multiline
                    />
                    <View style={styles.modalButtons}>
                        <Button
                            mode="outlined"
                            onPress={() => setEditModalVisible(false)}
                            style={styles.modalButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleEdit}
                            style={styles.modalButton}
                        >
                            Save Changes
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        backgroundColor: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        elevation: 2,
    },
    name: {
        marginTop: 8,
        fontWeight: 'bold',
    },
    username: {
        color: '#666',
        marginBottom: 16,
    },
    editButton: {
        marginTop: 8,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        marginLeft: 12,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    modalTitle: {
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 8,
    },
});

export default Profile;