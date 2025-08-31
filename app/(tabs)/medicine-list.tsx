import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function MedicineList() {
  const [medicines, setMedicines] = useState<{ name: string; expiry: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const colRef = collection(db, "users", user.uid, "medicines");
        const snapshot = await getDocs(colRef);
        const meds: { name: string; expiry: string }[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          meds.push({
            name: data.name || doc.id,
            expiry: data.expiry || "",
          });
        });
        setMedicines(meds);
      } catch (err: any) {
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/list.jpg")} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Medicine List</Text>
        {medicines.length === 0 ? (
          <Text style={{ marginTop: 20, color: "#fff" }}>No medicines found.</Text>
        ) : (
          <FlatList
            data={medicines}
            keyExtractor={(item, idx) => item.name + idx}
            renderItem={({ item }) => (
              <View style={styles.medicineBox}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <Text style={styles.expiry}>Expiry: {item.expiry}</Text>
              </View>
            )}
          />
        )}

        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
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
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)", // dark overlay so text is visible
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  medicineBox: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  medicineName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  expiry: { fontSize: 16, color: "#333" },
  button: {
    backgroundColor: "#228B22",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    alignSelf: "center",
    marginTop: "auto", // pushes button to bottom
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
