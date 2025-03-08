import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { singUp1 } from "@/services/auth/signup";

const Signup = () => {
    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];
    const inputFade1 = useState(new Animated.Value(0))[0];
    const inputFade2 = useState(new Animated.Value(0))[0];
    const buttonFade = useState(new Animated.Value(0))[0];
    const socialFade = useState(new Animated.Value(0))[0];
    const footerFade = useState(new Animated.Value(0))[0];

    // State for inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async () => {
        const payload = { email, password };
        console.log(payload)
        try {
            const res = await singUp1(payload);
            // console.log(res)
            if (res?.success) {
                router.push('/userdetails')
            }
        } catch (error) {
            console.log(error)
        }
    }
    // Run animations when component mounts
    useEffect(() => {
        // Sequence the animations
        Animated.sequence([
            // Fade in title with slide
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]),

            // Fade in first input
            Animated.timing(inputFade1, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),

            // Fade in second input
            Animated.timing(inputFade2, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),

            // Fade in button
            Animated.timing(buttonFade, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),

            // Fade in social buttons
            Animated.timing(socialFade, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),

            // Fade in footer
            Animated.timing(footerFade, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1563188997-9dd8144d4f91?q=80&w=1544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                style={styles.background}
                resizeMode="cover"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoid}
                >
                    <View style={styles.overlay}>
                        <Animated.Text
                            style={[
                                styles.title,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            Welcome
                        </Animated.Text>

                        <Animated.Text
                            style={[
                                styles.subtitle,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}

                        >
                            Create your account
                        </Animated.Text>

                        <Animated.View style={[styles.inputContainer, { opacity: inputFade1 }]}>
                            <Ionicons name="mail-outline" size={20} color="#ddd" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#ddd"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </Animated.View>

                        <Animated.View style={[styles.inputContainer, { opacity: inputFade2 }]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#ddd" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="#ddd"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </Animated.View>

                        <Animated.View style={{ opacity: buttonFade, width: "100%" }}>
                            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View style={[styles.orContainer, { opacity: socialFade }]}>
                            <View style={styles.orLine} />
                            <Text style={styles.orText}>or sign up with</Text>
                            <View style={styles.orLine} />
                        </Animated.View>

                        <Animated.View style={[styles.socialButtonsContainer, { opacity: socialFade }]}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-facebook" size={22} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                                <Ionicons name="logo-google" size={22} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                                <Ionicons name="logo-apple" size={22} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.Text style={[styles.footerText, { opacity: footerFade }]}>
                            Already have an account?{" "}
                            <Text style={styles.loginText} onPress={() => router.push('/login')}>
                                Login
                            </Text>
                        </Animated.Text>

                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    keyboardAvoid: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        // backgroundColor: "rgba(0, 0, 0, 0.65)",
        padding: 30,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        // shadowOpacity: 0.5,
        // shadowRadius: 20,
        // elevation: 15,
        backdropFilter: "blur(10px)",
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#ddd",
        marginBottom: 30,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 15,
        color: "#fff",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#ff6b6b",
        paddingVertical: 15,
        borderRadius: 12,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#ff6b6b",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    orText: {
        color: "#ddd",
        marginHorizontal: 10,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: "#3b5998", // Facebook blue
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    googleButton: {
        backgroundColor: "#DB4437", // Google red
    },
    appleButton: {
        backgroundColor: "#000", // Apple black
    },
    footerText: {
        color: "#fff",
        fontSize: 15,
    },
    loginText: {
        fontWeight: "bold",
        color: "#FFD700",
        textDecorationLine: "underline",
    },
});

export default Signup;