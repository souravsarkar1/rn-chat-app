import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ChatLayout = () => {
    return (
        <View style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                {/* <Stack.Screen name="chatDetail" options={{ headerShown: false }} /> */}
                {<Stack.Screen name='[chat_room]'
                    options={{
                        headerShown: false,
                        // headerTitle: "Product Details",
                        presentation: 'modal'
                    }} />}
            </Stack>
        </View>
    )
}

export default ChatLayout