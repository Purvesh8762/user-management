import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getLoginEmail } from "../utils/storage";

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const e = await getLoginEmail();
    setEmail(e);
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.replace("/(tabs)/UserListScreen?openSidebar=true")
          }
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {email?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.email}>{email}</Text>
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
  },
});
