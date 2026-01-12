import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

// Backend API URL
const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

export default function ForgotPasswordScreen() {
  // Store email input
  const [email, setEmail] = useState("");

  // Router for navigation
  const router = useRouter();

  // Send OTP button handler
  const sendOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter email");
      return;
    }

    try {
      const res = await fetch(
        `${API}/forgot-password?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      const msg = await res.text();

      if (res.ok) {
        Alert.alert("Success", msg);

        // Navigate to Reset Password screen with email
        router.push({
          pathname: "/(tabs)/ResetPasswordScreen",
          params: { email },
        });
      } else {
        Alert.alert("Error", msg || "OTP not sent");
      }
    } catch {
      Alert.alert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      {/* Screen title */}
      <Text style={styles.title}>Forgot Password</Text>

      {/* CARD BOX */}
      <View style={styles.card}>
        {/* Email input */}
        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Send OTP button */}
        <TouchableOpacity style={styles.btn} onPress={sendOtp}>
          <Text style={styles.btnText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// UI Styles
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#9fd3d6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

// card
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
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
