import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button, Text, Surface } from 'react-native-paper'
import { router } from 'expo-router'
import { loginFunction } from '@/redux/authentication/action'
import { useAppDispatch } from '@/redux/store'

const Login = () => {
    // State management for form fields
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useAppDispatch()
    // Handle login submission
    const handleLogin = async () => {
        // Reset error state
        setError('')

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            // Here you would typically make an API call to your backend
            // await loginUser(username, password)

            // Simulating API call with timeout
            try {
                // Clear form after successful login
                const res = await dispatch(loginFunction({ username, password, email: username } as any))
                console.log('res: ', res)
                console.log(res);
                if (res) {
                    setUsername('');
                    setPassword('');
                    router.push('(tabs)' as any)
                }

            } catch (error) {
                console.log(error);
            }





        } catch (err) {
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Surface style={styles.surface}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.form}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        autoCapitalize="none"
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        mode="outlined"
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    {error ? (
                        <Text style={styles.error}>{error}</Text>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        loading={loading}
                        disabled={loading}
                    >
                        Sign In
                    </Button>

                    <TouchableOpacity
                        // onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => null}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Surface>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',

    },
    surface: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
    },
    error: {
        color: '#B00020',
        textAlign: 'center',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    signUpText: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default Login