import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? "";

  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const resetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email missing. Please restart forgot password.");
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    if (!otp.trim() || !password.trim()) {
      Alert.alert("Error", "All fields required");
      return;
    }

    try {
      const res = await fetch(
        `${API}/reset-password?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp.trim())}&newPassword=${encodeURIComponent(
          password.trim()
        )}`,
        { method: "POST" }
      );

      const msg = await res.text();

      if (res.ok) {
        Alert.alert("Success", msg, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/LoginScreen"),
          },
        ]);
      } else {
        Alert.alert("Error", msg || "Password not reset");
      }
    } catch {
      Alert.alert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        placeholder="Enter OTP"
        style={styles.input}
        value={otp}
        onChangeText={(v) => setOtp(v)}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="New Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={(v) => setPassword(v)}
      />

      <TouchableOpacity style={styles.btn} onPress={resetPassword}>
        <Text style={styles.btnText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9fd3d6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 6,
    width: "80%",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
