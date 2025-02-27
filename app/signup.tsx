import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

const Signup = () => {
    // Step management (0 = email/password, 1 = personal info, 2 = confirmation)
    const [step, setStep] = useState(0);

    // Form data storage
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });

    // Error handling
    const [errors, setErrors] = useState<any>({});

    // Loading state
    const [loading, setLoading] = useState(false);

    // Define form fields for each step
    const stepOneFormData = [
        {
            id: 1,
            type: "input",
            placeholder: "Enter Your Email",
            name: "email",
            keyboardType: "email-address",
            autoCapitalize: "none"
        },
        {
            id: 2,
            type: "password",
            placeholder: "Create Password",
            name: "password",
            secureTextEntry: true
        },
        {
            id: 3,
            type: "password",
            placeholder: "Confirm Password",
            name: "confirmPassword",
            secureTextEntry: true
        }
    ];

    const stepTwoFormData = [
        {
            id: 1,
            type: "input",
            placeholder: "First Name",
            name: "firstName"
        },
        {
            id: 2,
            type: "input",
            placeholder: "Last Name",
            name: "lastName"
        },
        {
            id: 3,
            type: "input",
            placeholder: "Phone Number",
            name: "phone",
            keyboardType: "phone-pad"
        },
        {
            id: 4,
            type: "input",
            placeholder: "Address",
            name: "address",
            multiline: true
        }
    ];

    // Handle input changes
    const handleChange = (name: any, value: any) => {
        setUserData({
            ...userData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Validate current step
    const validateStep = () => {
        let isValid = true;
        const newErrors: any = {};

        if (step === 0) {
            // Validate email
            if (!userData.email) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
                newErrors.email = 'Email is invalid';
                isValid = false;
            }

            // Validate password
            if (!userData.password) {
                newErrors.password = 'Password is required';
                isValid = false;
            } else if (userData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
                isValid = false;
            }

            // Validate password confirmation
            if (userData.password !== userData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }
        } else if (step === 1) {
            // Validate first name
            if (!userData.firstName) {
                newErrors.firstName = 'First name is required';
                isValid = false;
            }

            // Validate last name
            if (!userData.lastName) {
                newErrors.lastName = 'Last name is required';
                isValid = false;
            }

            // Validate phone number
            if (!userData.phone) {
                newErrors.phone = 'Phone number is required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle moving to the next step
    const handleNextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    // Handle going back to the previous step
    const handlePrevStep = () => {
        setStep(step - 1);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateStep()) {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('Form submitted with data:', userData);
                setLoading(false);

                // Reset form after successful submission
                alert('Registration successful!');
                setUserData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    address: ''
                });
                setStep(0);
            } catch (error) {
                setLoading(false);
                alert('Registration failed. Please try again.');
            }
        }
    };

    // Render form fields
    const renderFormFields = (fields: any) => {
        return fields.map((field: any) => (
            <View key={field.id} style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, errors[field.name] ? styles.inputError : null]}
                    placeholder={field.placeholder}
                    placeholderTextColor="#9CA3AF"
                    //@ts-ignore
                    value={userData[field.name]}
                    onChangeText={(value) => handleChange(field.name, value)}
                    secureTextEntry={field.secureTextEntry}
                    keyboardType={field.keyboardType || 'default'}
                    autoCapitalize={field.autoCapitalize || 'sentences'}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 3 : 1}
                />
                {errors[field.name] ? (
                    <Text style={styles.errorText}>{errors[field.name]}</Text>
                ) : null}
            </View>
        ));
    };

    // Render step content
    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Create Your Account</Text>
                        <Text style={styles.stepDescription}>
                            Please enter your email and create a password to get started.
                        </Text>
                        {renderFormFields(stepOneFormData)}
                        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Personal Information</Text>
                        <Text style={styles.stepDescription}>
                            Tell us a bit about yourself to complete your profile.
                        </Text>
                        {renderFormFields(stepTwoFormData)}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevStep}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                                <Text style={styles.buttonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Confirm Your Details</Text>
                        <Text style={styles.stepDescription}>
                            Please review your information before submitting.
                        </Text>
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Email:</Text>
                                <Text style={styles.summaryValue}>{userData.email}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Name:</Text>
                                <Text style={styles.summaryValue}>{userData.firstName} {userData.lastName}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Phone:</Text>
                                <Text style={styles.summaryValue}>{userData.phone}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Address:</Text>
                                <Text style={styles.summaryValue}>{userData.address}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevStep}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Submit Registration</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    // Progress indicator
    const renderProgressBar = () => {
        return (
            <View style={styles.progressContainer}>
                <View style={styles.progressStepsContainer}>
                    {[0, 1, 2].map((index) => (
                        <View key={index} style={styles.progressStepWrapper}>
                            <View
                                style={[
                                    styles.progressStep,
                                    index <= step ? styles.progressStepActive : null
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressStepText,
                                        index <= step ? styles.progressStepTextActive : null
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                            <Text style={styles.progressStepLabel}>
                                {index === 0 ? 'Account' : index === 1 ? 'Personal' : 'Confirm'}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${(step / 2) * 100}%` }
                        ]}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sign Up</Text>
                    <Text style={styles.headerSubtitle}>Create a new account</Text>
                </View>

                {renderProgressBar()}

                <View style={styles.formContainer}>
                    {renderStepContent()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    progressContainer: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    progressStepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressStepWrapper: {
        alignItems: 'center',
    },
    progressStep: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressStepActive: {
        backgroundColor: '#4F46E5',
    },
    progressStepText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    progressStepTextActive: {
        color: '#FFFFFF',
    },
    progressStepLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 2,
    },
    formContainer: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    stepContainer: {
        padding: 24,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    secondaryButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.48,
    },
    secondaryButtonText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
        width: 80,
    },
    summaryValue: {
        fontSize: 15,
        color: '#1F2937',
        flex: 1,
    },
});

export default Signup;