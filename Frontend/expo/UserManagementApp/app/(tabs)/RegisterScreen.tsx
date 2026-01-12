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
import { useRouter } from "expo-router";

// Backend API URL (web vs mobile)
const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

// Works for web + mobile alert
const showAlert = (title: string, msg: string) => {
  if (Platform.OS === "web") {
    window.alert(title + "\n" + msg);
  } else {
    Alert.alert(title, msg);
  }
};

export default function RegisterScreen() {
  const router = useRouter();

  // Input states
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handles register button click
  const register = async () => {
    const n = name.trim();
    const e = email.trim();
    const p = password.trim();

    // Validation: empty fields
    if (!n || !e || !p) {
      showAlert("Error", "All fields are required");
      return;
    }

    // Validation: email format
    if (!e.includes("@")) {
      showAlert("Error", "Enter valid email");
      return;
    }

    // Password strength rule
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(p)) {
      showAlert(
        "Error",
        "Password must contain:\n• 1 Capital letter\n• 1 Small letter\n• 1 Number\n• 1 Special symbol\n• Minimum 8 characters"
      );
      return;
    }

    try {
      // Call backend register API
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: n,
          email: e,
          password: p,
        }).toString(),
      });

      const text = await res.text();

      // If registration success
      if (res.ok) {
        showAlert("Success", "Registration successful");
        router.replace("/(tabs)/LoginScreen");
      } else {
        showAlert("Error", text || "Email already exists");
      }
    } catch {
      showAlert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.card}>
        {/* Name input */}
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={(v) => setName(v)}
        />

        {/* Email input */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(v) => setEmail(v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password input */}
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(v) => setPassword(v)}
        />

        {/* Register button */}
        <TouchableOpacity style={styles.btn} onPress={register}>
          <Text style={styles.btnText}>REGISTER</Text>
        </TouchableOpacity>

        {/* Navigate to login */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/LoginScreen")}
        >
          <Text style={styles.link}>Already have account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// UI styles
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#9fd3d6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
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
    marginTop: 10,
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
