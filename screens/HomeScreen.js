import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 MediTrack</Text>
      <Button
        title="➕ Add Medicine"
        onPress={() => navigation.navigate("Add Medicine")}
      />
      <Button
        title="📅 Expiry List"
        onPress={() => navigation.navigate("Expiry List")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
