import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
    return (
        <View>
            <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='friends' options={{ headerShown: false }} />
            </Stack>
        </View>
    )
}

export default ProfileLayout