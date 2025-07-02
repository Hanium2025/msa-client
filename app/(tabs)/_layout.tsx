import { Tabs } from "expo-router";

export default function RootLayout() {
    return <Tabs>

        <Tabs.Screen name="notification" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="community" />
        <Tabs.Screen name="profile" />
    </Tabs>
}
