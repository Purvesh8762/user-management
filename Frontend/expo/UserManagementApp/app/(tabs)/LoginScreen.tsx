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
import {
  saveLoginEmail,
  saveAdminId,
  saveToken,
} from "../../utils/storage";

const API = process.env.EXPO_PUBLIC_API_URL;

type LoginResponse = {
  id: number;
  email: string;
  token: string;
  type: string;
};

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const e = email.trim().toLowerCase();
    const p = password.trim();

    if (!e || !p) {
      Alert.alert("Validation Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          password: p,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert("Login Failed", text || "Invalid email or password");
        return;
      }

      let data: LoginResponse;

      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert("Error", "Invalid server response");
        return;
      }

      await saveLoginEmail(data.email);
      await saveAdminId(data.id);

      // Always save as "Bearer token"
      await saveToken(`${data.type} ${data.token}`);

      Alert.alert("Success", "Login successful");

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

      <View style={styles.card}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eye}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/RegisterScreen")}
        >
          <Text style={styles.link}>New user? Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/ForgotPasswordScreen")}
        >
          <Text style={styles.link}>Forgot Password?</Text>
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
