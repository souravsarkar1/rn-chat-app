import { Animated, Easing } from "react-native"

// Bounce animation for buttons
export const createBounceAnimation = (scaleValue: Animated.Value) => {
    return Animated.sequence([
        Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 100,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }),
    ])
}

// Pulse animation for likes
export const createPulseAnimation = (scaleValue: Animated.Value) => {
    return Animated.sequence([
        Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 150,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }),
    ])
}

// Fade in animation
export const createFadeInAnimation = (fadeValue: Animated.Value, duration = 500) => {
    return Animated.timing(fadeValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
    })
}

// Slide in animation
export const createSlideInAnimation = (translateValue: Animated.Value, fromValue: number, duration = 500) => {
    return Animated.timing(translateValue, {
        toValue: 0,
        duration,
        useNativeDriver: true,
    })
}

