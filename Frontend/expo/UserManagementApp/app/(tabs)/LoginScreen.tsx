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

const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

type LoginResponse = {
  id: number;
  email: string;
};

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const e = email.trim();
    const p = password.trim();

    if (!e || !p) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e,
          password: p,
        }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data?.id) {
        Alert.alert("Login Failed", "Invalid credentials");
        return;
      }

      // ✅ Save admin info
      await saveLoginEmail(data.email);
      await saveAdminId(data.id);

      // ✅ Navigate
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

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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
    marginBottom: 25,
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
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
});
