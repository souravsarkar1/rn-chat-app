import React, { useEffect } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { Button, Text, Surface, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    Easing,
    interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
    const router = useRouter();

    // Animation values
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.5);
    const subtitleOpacity = useSharedValue(0);
    const buttonContainerOpacity = useSharedValue(0);
    const buttonContainerTranslateY = useSharedValue(50);
    const backgroundScale = useSharedValue(1.1);

    // Floating animation for logo
    const floatValue = useSharedValue(0);

    useEffect(() => {
        // Initial animations
        logoOpacity.value = withDelay(300, withTiming(1, { duration: 1000 }));
        logoScale.value = withDelay(300, withSpring(1, { damping: 12 }));
        subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
        buttonContainerOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
        buttonContainerTranslateY.value = withDelay(1200, withSpring(0, { damping: 12 }));
        backgroundScale.value = withTiming(1, { duration: 5000, easing: Easing.out(Easing.exp) });

        // Continuous floating animation
        const interval = setInterval(() => {
            floatValue.value = withTiming(1, { duration: 2000 }, () => {
                floatValue.value = withTiming(0, { duration: 2000 });
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Animated styles
    //@ts-ignore
    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: logoOpacity.value,
            transform: [
                { scale: logoScale.value },
                { translateY: interpolate(floatValue.value, [0, 1], [0, -10]) }
            ]
        };
    });
    //@ts-ignore

    //@ts-ignore
    const subtitleAnimatedStyle: Animated.AnimatedStyleProp<ViewStyle> = useAnimatedStyle(() => {
        return {
            opacity: subtitleOpacity.value,
            transform: [
                { translateY: interpolate(floatValue.value, [0, 1], [0, -5]) }
            ]
        };
    });
    //@ts-ignore

    const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonContainerOpacity.value,
            transform: [{ translateY: buttonContainerTranslateY.value }]
        };
    });
    //@ts-ignore

    const backgroundAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: backgroundScale.value }]
        };
    });

    return (
        <PaperProvider>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                {
                    //@ts-ignore
                }
                <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle] as any}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?q=80&w=1920' }}
                        style={styles.backgroundImage}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                            style={styles.gradient}
                        >
                            <View style={styles.content}>
                                <View style={styles.titleWrapper}>
                                    <Animated.View style={[styles.titleContainer, logoAnimatedStyle] as any}>
                                        <Text style={styles.title}>VibeTalk</Text>
                                    </Animated.View>

                                    <Animated.View style={subtitleAnimatedStyle}>
                                        <Text style={styles.subtitle}>Connect through conversations</Text>
                                    </Animated.View>
                                </View>

                                <Animated.View style={[styles.buttonContainer, buttonContainerAnimatedStyle] as any}>
                                    <Button
                                        mode="contained"
                                        onPress={() => router.push('/login')}
                                        style={[styles.button, styles.getStartedButton]}
                                        contentStyle={styles.buttonContent}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        Get Started
                                    </Button>

                                    <Button
                                        mode="outlined"
                                        onPress={() => router.push('/(tabs)/home')}
                                        style={[styles.button, styles.signUpButton]}
                                        contentStyle={styles.buttonContent}
                                        labelStyle={styles.signUpButtonLabel}
                                    >
                                        Create Account
                                    </Button>

                                    <Button
                                        mode="text"
                                        onPress={() => { }}
                                        labelStyle={styles.learnMoreLabel}
                                    >
                                        Learn More
                                    </Button>
                                </Animated.View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </Animated.View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        flex: 1,
        width: width,
        height: height,
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
        paddingTop: (StatusBar.currentHeight || 0) + 100,
        paddingBottom: 60,
    },
    titleWrapper: {
        alignItems: 'center',
        marginTop: 40,
    },
    titleContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: 20,
        color: '#FFFFFF',
        marginTop: 16,
        textAlign: 'center',
        opacity: 0.9,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
        paddingHorizontal: 20,
    },
    button: {
        borderRadius: 30,
    },
    buttonContent: {
        height: 56,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    getStartedButton: {
        backgroundColor: '#6C63FF',
    },
    signUpButton: {
        borderColor: '#FFFFFF',
        borderWidth: 2,
    },
    signUpButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    learnMoreLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

export default LandingScreen;