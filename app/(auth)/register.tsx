import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password || !rePassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (password !== rePassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        firstName,
        lastName,
        username,
        email,
        uid: userCred.user.uid,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Account created! Please login.");
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Registration Error", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpeg")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
              placeholder="First Name"
              placeholderTextColor="#ccc"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />

            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#ccc"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />

            <TextInput
              placeholder="Username"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Text style={styles.toggleText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Re-enter Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showRePassword}
                value={rePassword}
                onChangeText={setRePassword}
                style={[styles.input, { flex: 1 }]}
                contextMenuHidden={true}
              />
              <TouchableOpacity onPress={() => setShowRePassword((prev) => !prev)}>
                <Text style={styles.toggleText}>
                  {showRePassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Already have an account? Login</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
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
    marginBottom: 25,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 12,
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  toggleText: {
    color: "#00BFFF",
    fontWeight: "600",
    marginLeft: 10,
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#6a11cb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
