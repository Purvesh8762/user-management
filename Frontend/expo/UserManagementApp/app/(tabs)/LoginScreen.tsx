import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  saveLoginEmail,
  saveAdminId,
} from "../utils/storage";

// Backend API URL
const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

// Expected backend response type
type LoginResponse = {
  id: number;
  email: string;
};

export default function LoginScreen() {
  const router = useRouter();

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Loading state for button
  const [loading, setLoading] = useState(false);

  // Handles login button click
  const login = async () => {
    const e = email.trim();
    const p = password.trim();

    // Validation: empty fields
    if (!e || !p) {
      Alert.alert("Validation Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // Call backend login API
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          password: p,
        }),
      });

      const text = await res.text();

      // If backend returns error
      if (!res.ok) {
        Alert.alert("Login Failed", text || "Invalid email or password");
        return;
      }

      // Convert response text to JSON
      const data: LoginResponse = JSON.parse(text);

      // Save login info in local storage
      await saveLoginEmail(data.email);
      await saveAdminId(data.id);

      Alert.alert("Success", "Login successful");

      // Navigate to user list screen
      router.replace("/(tabs)/UserListScreen");
    } catch {
      Alert.alert("Error", "Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>UserDesk Login</Text>

      {/* CARD BOX */}
      <View style={styles.card}>
        {/* Email Input */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Input with Eye Icon */}
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          {/* Toggle password visibility */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eye}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Navigate to Register */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/RegisterScreen")}
        >
          <Text style={styles.link}>New user? Register</Text>
        </TouchableOpacity>

        {/* Navigate to Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/ForgotPasswordScreen")}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// UI Styles
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9fd3d6",
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
    marginTop: 5,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "blue",
    textAlign: "center",
    marginTop: 12,
  },
});
