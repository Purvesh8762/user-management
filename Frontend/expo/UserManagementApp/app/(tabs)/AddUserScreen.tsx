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

// Backend API URL
const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

export default function AddUserScreen() {
  const router = useRouter();

  // Store input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Button loading state
  const [loading, setLoading] = useState(false);

  // ADD USER FUNCTION
  const addUser = async () => {
    const n = name.trim();
    const e = email.trim();

    //  NAME VALIDATION
    // Only letters and spaces, max 50 characters
    const nameRegex = /^[A-Za-z\s]{1,50}$/;

    if (!n) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }

    if (!nameRegex.test(n)) {
      Alert.alert(
        "Validation Error",
        "Name must contain only letters and spaces (maximum 50 characters)"
      );
      return;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!e) {
      Alert.alert("Validation Error", "Email is required");
      return;
    }

    if (!emailRegex.test(e)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    // ADMIN LOGIN CHECK
    const adminId = await getAdminId();

    if (!adminId) {
      Alert.alert("Session Expired", "Please login again");
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    try {
      setLoading(true);

      // Call backend API to add user
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
        // Show success message
        Alert.alert("Success", "User added successfully");

        // Clear input fields so old values are not kept
        setName("");
        setEmail("");

        // Go back to user list
        router.replace("/(tabs)/UserListScreen");
      } else {
        // Backend returned error
        Alert.alert("Error", msg || "User not added");
      }
    } catch {
      // Server not reachable
      Alert.alert("Error", "Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Add New User</Text>

      {/* Card container */}
      <View style={styles.card}>
        {/* Name Input */}
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          maxLength={50}
          onChangeText={(text) => {
            // Allow only letters and spaces while typing
            const regex = /^[A-Za-z\s]*$/;

            if (!regex.test(text)) {
              Alert.alert(
                "Invalid Name",
                "Name can contain only letters and spaces"
              );
              return;
            }

            setName(text);
          }}
        />

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Add User Button */}
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

// UI STYLES 
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
    elevation: 5,
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
