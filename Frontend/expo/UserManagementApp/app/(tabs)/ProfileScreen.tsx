import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  getLoginEmail,
  getToken,
  clearStorage,
} from "../../utils/storage";


export default function ProfileScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const e = await getLoginEmail();
    const token = await getToken();

    if (!e || !token) {
      await clearStorage();
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    setEmail(e);
  };

  const logout = async () => {
    await clearStorage();
    router.replace("/(tabs)/LoginScreen");
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/UserListScreen")}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(email || "U").charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#9fd3d6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1e90ff",
  },

  back: {
    fontSize: 22,
    color: "white",
    marginRight: 15,
  },

  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  email: {
    fontSize: 16,
    marginBottom: 25,
  },

  logoutBtn: {
    backgroundColor: "red",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
