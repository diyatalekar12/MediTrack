import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(auth)/login" options={{ title: "Login" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
}
