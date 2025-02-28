import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Dimensions
} from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { useAppDispatch } from '@/redux/store';
import { loginFunction } from '@/redux/authentication/action';

const { width, height } = Dimensions.get('window');

const Login = () => {
    // State management for form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Animation values
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(50);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(-20);

    useEffect(() => {
        // Animate form elements when component mounts
        titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
        titleTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));
        formOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
        formTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));
    }, []);

    // Animated styles
    //@ts-ignore
    const titleAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: titleOpacity.value,
            transform: [{ translateY: titleTranslateY.value }]
        };
    });
    //@ts-ignore

    const formAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: formOpacity.value,
            transform: [{ translateY: formTranslateY.value }]
        };
    });

    // Handle login submission
    const handleLogin = async () => {
        // Reset error state
        setError('');

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            // Simulating API call with timeout
            const res = await dispatch(loginFunction({ username: username.trim(), email: username.trim(), password }));
            if (res.success) {
                router.push('/(tabs)/home' as any);
            }
            // setTimeout(() => {
            //     setLoading(false);
            //     // Navigate to home screen on successful login
            //     
            // }, 1500);
        } catch (err) {
            setError('Invalid username or password');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920' }}
                    style={styles.backgroundImage}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                        style={styles.gradient}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.content}
                        >
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <ArrowLeft color="#fff" size={24} />
                            </TouchableOpacity>

                            <View style={styles.contentContainer}>
                                <Animated.View style={[styles.titleContainer, titleAnimatedStyle] as any}>
                                    <Text style={styles.title}>Welcome Back</Text>
                                    <Text style={styles.subtitle}>Sign in to continue</Text>
                                </Animated.View>

                                <Animated.View style={[styles.form, formAnimatedStyle] as any}>
                                    <TextInput
                                        label="Username or Email"
                                        value={username}
                                        onChangeText={setUsername}
                                        style={styles.input}
                                        autoCapitalize="none"
                                        mode="outlined"
                                        left={<TextInput.Icon icon="account" color="#fff" />}
                                        outlineStyle={styles.inputOutline}
                                        textColor="#fff"
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        theme={{
                                            colors: {
                                                primary: '#fff',
                                                outline: 'rgba(255,255,255,0.5)',
                                                onSurfaceVariant: 'rgba(255,255,255,0.7)',
                                            }
                                        }}
                                    />

                                    <TextInput
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        style={styles.input}
                                        mode="outlined"
                                        left={<TextInput.Icon icon="lock" color="#fff" />}
                                        right={
                                            <TextInput.Icon
                                                icon={showPassword ? "eye-off" : "eye"}
                                                onPress={() => setShowPassword(!showPassword)}
                                                color="#fff"
                                            />
                                        }
                                        outlineStyle={styles.inputOutline}
                                        textColor="#fff"
                                        placeholderTextColor="rgba(255,255,255,0.7)"
                                        theme={{
                                            colors: {
                                                primary: '#fff',
                                                outline: 'rgba(255,255,255,0.5)',
                                                onSurfaceVariant: 'rgba(255,255,255,0.7)',
                                            }
                                        }}
                                    />

                                    {error ? (
                                        <Text style={styles.error}>{error}</Text>
                                    ) : null}

                                    <Button
                                        mode="contained"
                                        onPress={handleLogin}
                                        style={styles.loginButton}
                                        contentStyle={styles.buttonContent}
                                        loading={loading}
                                        disabled={loading}
                                        labelStyle={styles.buttonLabel}
                                    >
                                        Sign In
                                    </Button>

                                    <TouchableOpacity
                                        style={styles.forgotPassword}
                                    >
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </TouchableOpacity>

                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => router.push("/signup")}>
                                            <Text style={styles.signUpText}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            </View>
                        </KeyboardAvoidingView>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </PaperProvider>
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
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (StatusBar.currentHeight || 0) + 20,
    },
    backButton: {
        position: 'absolute',
        top: (StatusBar.currentHeight || 0) + 20,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        padding: 20,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    inputOutline: {
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    loginButton: {
        borderRadius: 30,
        marginTop: 8,
        backgroundColor: '#6C63FF',
    },
    buttonContent: {
        height: 50,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    error: {
        color: '#FF6B6B',
        textAlign: 'center',
        marginTop: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: '#FFFFFF',
        fontSize: 14,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    signUpText: {
        color: '#A5A1FF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
});

export default Login;