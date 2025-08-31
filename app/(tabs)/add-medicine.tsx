import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ImageBackground,
  ScrollView,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native"; // 👈 import navigation

export default function AddMedicine() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [medicineName, setMedicineName] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [barcodeGTIN, setBarcodeGTIN] = useState("");
  const [barcodeExpiry, setBarcodeExpiry] = useState("");

  const cameraRef = useRef<any>(null);
  const navigation = useNavigation(); // 👈 use navigation

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    setShowScanner(true);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setShowScanner(false);

    let gtin = "";
    let expiry = "";
    const gtinMatch = data.match(/\(01\)(\d{14})/);
    const expiryMatch = data.match(/\(17\)(\d{6})/);
    if (gtinMatch) gtin = gtinMatch[1];
    if (expiryMatch) {
      const y = "20" + expiryMatch[1].slice(0, 2);
      const m = expiryMatch[1].slice(2, 4);
      const d = expiryMatch[1].slice(4, 6);
      expiry = `${y}-${m}-${d}`;
    }

    setBarcodeGTIN(gtin);
    setBarcodeExpiry(expiry);

    if (gtin && expiry) {
      saveMedicine(gtin, expiry);
    } else {
      Alert.alert("Scan Error", "Could not extract GTIN or Expiry Date from barcode.");
    }
  };

  const saveMedicine = async (name: string, expiry: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");
      const docRef = doc(db, "users", user.uid, "medicines", name);
      await setDoc(docRef, {
        name,
        expiry,
        addedAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Medicine saved!");
      setMedicineName("");
      setExpiryDate(null);
      setBarcodeGTIN("");
      setBarcodeExpiry("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleManualAdd = () => {
    if (!medicineName || !expiryDate) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    saveMedicine(medicineName, expiryDate.toISOString().split("T")[0]); // YYYY-MM-DD
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/list.jpg")} style={styles.bg}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add Medicine</Text>

          {/* Barcode Section */}
          <Text style={styles.sectionTitle}>Scan using barcode</Text>
          <TouchableOpacity style={styles.greenButton} onPress={requestPermission}>
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>
          {barcodeGTIN ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>GTIN: {barcodeGTIN}</Text>
              <Text style={styles.resultText}>Expiry: {barcodeExpiry}</Text>
            </View>
          ) : null}

          {/* Barcode Scanner Modal */}
          <Modal visible={showScanner} animationType="slide">
            <View style={{ flex: 1 }}>
              {hasPermission === false ? (
                <Text style={{ margin: 20 }}>No access to camera</Text>
              ) : (
                <Camera
                  ref={cameraRef}
                  style={{ flex: 1 }}
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
              )}
              <TouchableOpacity
                style={{ padding: 20, backgroundColor: "#fff" }}
                onPress={() => setShowScanner(false)}
              >
                <Text style={{ color: "red", textAlign: "center" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Manual Section */}
          <Text style={styles.sectionTitle}>Or Add Manually</Text>
          <TextInput
            placeholder="Name of the medicine"
            placeholderTextColor="#666"
            value={medicineName}
            onChangeText={setMedicineName}
            style={styles.input}
          />

          {/* Date Picker Input */}
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: expiryDate ? "#000" : "#666", fontSize: 16 }}>
              {expiryDate ? expiryDate.toDateString() : "Date of Expiry"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate || new Date()}
              mode="date"
              display="calendar"
              onChange={onChangeDate}
            />
          )}

          <TouchableOpacity style={styles.greenButton} onPress={handleManualAdd}>
            <Text style={styles.buttonText}>Add Medicine</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ✅ Go Back Button at Bottom */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("index")} // 👈 navigate to Home
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 30,
    paddingBottom: 100, // space for back button
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 20,
    marginBottom: 12,
  },
  greenButton: {
    backgroundColor: "#228B22",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    opacity: 0.95,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 16,
    color: "#000",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "60%",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
