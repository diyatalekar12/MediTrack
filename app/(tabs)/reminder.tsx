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

function getExpiryStatus(expiry: string) {
  const today = new Date();
  const expDate = new Date(expiry);
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 5) return "red";
  if (diffDays <= 31) return "orange";
  return "normal";
}

export default function Reminder() {
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
          if (data.expiry) {
            meds.push({
              name: data.name || doc.id,
              expiry: data.expiry,
            });
          }
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

  const filtered = medicines.filter((med) => {
    const status = getExpiryStatus(med.expiry);
    return status === "red" || status === "orange" || status === "expired";
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/list.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Expiry Reminders</Text>
        {filtered.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No medicines expiring soon.</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, idx) => item.name + idx}
            renderItem={({ item }) => {
              const status = getExpiryStatus(item.expiry);
              let color = "#222";
              if (status === "orange") color = "#FF9800";
              if (status === "red" || status === "expired") color = "#E53935";
              return (
                <View
                  style={[styles.medicineBox, { borderColor: color, borderWidth: 2 }]}
                >
                  <Text style={[styles.medicineName, { color }]}>{item.name}</Text>
                  <Text style={{ color }}>
                    Expiry: {item.expiry} {status === "expired" ? "(Expired)" : ""}
                  </Text>
                </View>
              );
            }}
          />
        )}

        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("index")} // 👈 navigate to your Home screen
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: { flex: 1, padding: 20, backgroundColor: "rgba(255,255,255,0.8)" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  medicineBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  medicineName: { fontSize: 18, fontWeight: "bold" },
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
  backButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
