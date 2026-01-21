import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

const API = process.env.EXPO_PUBLIC_API_URL;

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = (params.email ?? "").toLowerCase();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const resetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email missing. Please restart forgot password.");
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    if (!otp.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp.trim(),
          newPassword: password.trim(),
        }),
      });

      const msg = await res.text();

      if (!res.ok) {
        Alert.alert("Error", msg || "Password not reset");
        return;
      }

      Alert.alert("Success", msg, [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/LoginScreen"),
        },
      ]);
    } catch {
      Alert.alert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter OTP"
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="New Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eye}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Re-enter Password"
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.eye}>
              {showConfirmPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {password.length > 0 && confirmPassword.length > 0 && (
          <Text
            style={{
              color: passwordsMatch ? "green" : "red",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {passwordsMatch
              ? "Passwords match"
              : "Passwords do not match"}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.btn,
            { opacity: passwordsMatch ? 1 : 0.5 },
          ]}
          onPress={resetPassword}
          disabled={!passwordsMatch}
        >
          <Text style={styles.btnText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
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
  passwordBox: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eye: {
    fontSize: 18,
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
