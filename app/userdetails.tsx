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
    Platform,
    Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { singUp1 } from "@/services/auth/signup";

const Signup = () => {
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];
    const inputFade = useState(new Animated.Value(0))[0];
    const buttonFade = useState(new Animated.Value(0))[0];

    const [formData, setFormData] = useState({
        fullName: "",
        status: "",
        profilePic: ""
    });

    const handleChange = (key: any, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            handleChange("profilePic", result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        console.log(formData);
        try {
            const res = await singUp1(formData);
            if (res?.success) {
                router.push('/userdetails');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true })
            ]),
            Animated.timing(inputFade, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(buttonFade, { toValue: 1, duration: 500, useNativeDriver: true })
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1563188997-9dd8144d4f91?q=80&w=1544&auto=format&fit=crop" }} style={styles.background} resizeMode="cover">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
                    <View style={styles.overlay}>
                        <Animated.Text style={[styles.title, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>Enter Your Details</Animated.Text>
                        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>Only 1 step remain</Animated.Text>

                        <Animated.View style={[styles.inputContainer, { opacity: inputFade }]}>
                            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#ddd" value={formData.fullName} onChangeText={(text) => handleChange("fullName", text)} />
                        </Animated.View>

                        <Animated.View style={[styles.inputContainer, { opacity: inputFade }]}>
                            <TextInput style={styles.input} placeholder="Status" placeholderTextColor="#ddd" value={formData.status} onChangeText={(text) => handleChange("status", text)} />
                        </Animated.View>

                        <TouchableOpacity style={[styles.inputContainer, styles.imagePicker]} onPress={pickImage}>
                            {formData.profilePic ? <Image source={{ uri: formData.profilePic }} style={styles.image} /> : <Text style={styles.imageText}>Pick Profile Image</Text>}
                        </TouchableOpacity>

                        <Animated.View style={{ opacity: buttonFade, width: "100%" }}>
                            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text style={styles.buttonText}>Let's Start</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, justifyContent: "center", alignItems: "center" },
    keyboardAvoid: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
    overlay: { padding: 30, borderRadius: 20, width: "100%", alignItems: "center" },
    title: { fontSize: 38, fontWeight: "bold", color: "#fff", marginBottom: 5, textAlign: "center" },
    subtitle: { fontSize: 16, color: "#ddd", marginBottom: 30, textAlign: "center" },
    inputContainer: { flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: 12, marginBottom: 16, paddingHorizontal: 15 },
    input: { flex: 1, padding: 15, color: "#fff", fontSize: 16 },
    button: { backgroundColor: "#ff6b6b", paddingVertical: 15, borderRadius: 12, width: "100%", alignItems: "center", marginTop: 10 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    imagePicker: { justifyContent: "center", alignItems: "center", paddingVertical: 20 },
    imageText: { color: "#ddd" },
    image: { width: 80, height: 80, borderRadius: 40 }
});

export default Signup;
