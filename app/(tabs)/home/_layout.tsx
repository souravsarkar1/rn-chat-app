import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const HomeLayout = () => {
    return (
        <View style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
            </Stack>
        </View>
    )
}

export default HomeLayout