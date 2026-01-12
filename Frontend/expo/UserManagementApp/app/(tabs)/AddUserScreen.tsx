import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getAdminId } from "../utils/storage";

const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

export default function AddUserScreen() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const addUser = async () => {
    const n = name.trim();
    const e = email.trim();

    if (!n || !e) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const adminId = await getAdminId();

    if (!adminId) {
      Alert.alert("Error", "Login expired. Please login again.");
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: n,
          email: e,
          adminId: adminId.toString(),
        }).toString(),
      });

      const msg = await res.text();

      if (res.ok) {
        Alert.alert(
          "Success",
          "User added successfully",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/UserListScreen"),
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", msg || "User not added");
      }
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
          onChangeText={(v) => setName(v)}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(v) => setEmail(v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.btn} onPress={addUser} disabled={loading}>
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
    backgroundColor: "#e9f7fb",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "white",
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
