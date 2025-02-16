import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const LandingScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../assets/images/landing.jpg')} // You'll need to add this image
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Surface style={styles.titleContainer} elevation={0}>
                            <Text style={styles.title}>VibeTalk</Text>
                            <Text style={styles.subtitle}>Connect through conversations</Text>
                        </Surface>

                        <View style={styles.buttonContainer}>
                            <Button
                                mode="contained"
                                onPress={() => router.push('/login')}
                                style={[styles.button, styles.signUpButton]}
                                contentStyle={styles.buttonContent}
                                labelStyle={styles.buttonLabel}
                            >
                                Sign In
                            </Button>

                            <Button
                                mode="outlined"
                                onPress={() => router.push('(tabs)' as any)}
                                style={[styles.button, styles.signUpButton]}
                                contentStyle={styles.buttonContent}
                                labelStyle={styles.signUpButtonLabel}
                            >
                                Create Account
                            </Button>

                            <Button
                                mode="text"
                                // onPress={() => navigation.navigate('About')}
                                labelStyle={styles.learnMoreLabel}
                            >
                                Learn More
                            </Button>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: (StatusBar.currentHeight || 0) + 200,
        paddingBottom: 40,
    },
    titleContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        borderRadius: 30,
    },
    buttonContent: {
        height: 56,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        borderColor: '#FFFFFF',
        borderWidth: 2,
    },
    signUpButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    learnMoreLabel: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default LandingScreen;