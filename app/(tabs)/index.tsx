import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/home.webp")} // use your leafy bg image
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../medicine-list")}
        >
          <Text style={styles.buttonText}>View Medicine List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-medicine")}
        >
          <Text style={styles.buttonText}>Add New Medicine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../reminder")}
        >
          <Text style={styles.buttonText}>Reminder</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  button: {
  width: "60%",
  backgroundColor: "#228B22",
  padding: 10,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 70,
  opacity: 0.9,
  marginTop: -50, // ⬅️ nudges button group upward
},

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
