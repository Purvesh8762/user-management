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

const API =
  Platform.OS === "web"
    ? "http://localhost:8082/api"
    : "http://10.193.30.67:8082/api";

const showAlert = (title: string, msg: string) => {
  if (Platform.OS === "web") {
    window.alert(title + "\n" + msg);
  } else {
    Alert.alert(title, msg);
  }
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    if (!email.trim()) {
      showAlert("Error", "Enter email");
      return;
    }

    try {
      const res = await fetch(
        `${API}/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const msg = await res.text();

      if (res.ok) {
        showAlert("Success", msg);

        // ✅ Expo Router path must include (tabs)
        router.push({
          pathname: "/(tabs)/ResetPasswordScreen",
          params: { email },
        });
      } else {
        showAlert("Error", msg || "OTP not sent");
      }
    } catch (e) {
      showAlert("Error", "Backend not reachable");
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={sendOtp}>
        <Text style={styles.btnText}>Send OTP</Text>
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
