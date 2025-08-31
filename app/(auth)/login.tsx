import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "68543677304-ef2igjj54236lp9bsi4qtrd9ftk0n4jm.apps.googleusercontent.com",
    androidClientId: "68543677304-r1it09m2mof5qphfdtp90oujc049ql6u.apps.googleusercontent.com",
    webClientId: "68543677304-ef2igjj54236lp9bsi4qtrd9ftk0n4jm.apps.googleusercontent.com",
  });

  // Handle Google login response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCred) => {
          await setDoc(
            doc(db, "users", userCred.user.uid),
            {
              email: userCred.user.email,
              provider: "google",
              uid: userCred.user.uid,
            },
            { merge: true }
          );
          router.replace("/(tabs)");
        })
        .catch((err) => Alert.alert("Google Login Error", err.message));
    }
  }, [response]);

  // Email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(
        doc(db, "users", userCred.user.uid),
        {
          email: userCred.user.email,
          provider: "email",
          uid: userCred.user.uid,
        },
        { merge: true }
      );
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpeg")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email ID"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Google Login */}
            <TouchableOpacity onPress={() => promptAsync()} disabled={!request}>
              <Text style={styles.googleText}>Login with Google</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerText}>New User? Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)", // glass effect
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 12,
    marginBottom: 18,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#6a11cb", // solid fallback color
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleText: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  registerText: {
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
