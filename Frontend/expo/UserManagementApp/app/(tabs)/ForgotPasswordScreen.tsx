import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const API = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    const e = email.trim().toLowerCase();

    if (!e) {
      Alert.alert("Validation Error", "Please enter email");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: e }),
      });

      const msg = await res.text();

      if (!res.ok) {
        Alert.alert("Error", msg || "OTP not sent");
        return;
      }

      Alert.alert("Success", msg);

      router.push({
        pathname: "/(tabs)/ResetPasswordScreen",
        params: { email: e },
      });
    } catch {
      Alert.alert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.btn} onPress={sendOtp}>
          <Text style={styles.btnText}>Send OTP</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
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
