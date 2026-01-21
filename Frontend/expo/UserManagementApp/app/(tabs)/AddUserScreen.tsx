import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getToken, clearStorage } from "../../utils/storage";

const API = process.env.EXPO_PUBLIC_API_URL;

export default function AddUserScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const addUser = async () => {
    const n = name.trim();
    const e = email.trim().toLowerCase();

    // ---------- VALIDATION ----------
    if (!n) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }

    if (!/^[A-Za-z\s]{1,50}$/.test(n)) {
      Alert.alert(
        "Validation Error",
        "Name must contain only letters and spaces (max 50 chars)"
      );
      return;
    }

    if (!e) {
      Alert.alert("Validation Error", "Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      Alert.alert("Validation Error", "Invalid email format");
      return;
    }

    const token = await getToken();

    if (!token) {
      await clearStorage();
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Bearer token
        },
        body: JSON.stringify({
          name: n,
          email: e,
        }),
      });

      if (res.status === 401) {
        await clearStorage();
        router.replace("/(tabs)/LoginScreen");
        return;
      }

      const msg = await res.text();

      if (!res.ok) {
        Alert.alert("Error", msg || "User not added");
        return;
      }

      Alert.alert("Success", "User added successfully");

      setName("");
      setEmail("");

      router.replace("/(tabs)/UserListScreen");
    } catch {
      Alert.alert("Error", "Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Add New User</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          maxLength={50}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={addUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>ADD USER</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#9fd3d6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  btn: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
