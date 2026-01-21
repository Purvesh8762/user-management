import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { useRef, useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  clearStorage,
  getLoginEmail,
  getToken,
} from "../../utils/storage";


const API = process.env.EXPO_PUBLIC_API_URL;

const SCREEN_WIDTH = Dimensions.get("window").width;

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserListScreen() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const [showSidebar, setShowSidebar] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    const token = await getToken();

    if (!token) {
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/users/list`, {
        headers: {
          Authorization: token, // already contains Bearer
        },
      });

      if (!res.ok) {
        await clearStorage();
        router.replace("/(tabs)/LoginScreen");
        return;
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Error", "Unable to load users");
    }
  };

  const deleteUser = async (id: number) => {
    const token = await getToken();

    if (!token) return;

    try {
      const res = await fetch(`${API}/api/auth/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        Alert.alert("Error", "Delete failed");
        return;
      }

      Alert.alert("Success", "User deleted");
      loadUsers();
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete User", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteUser(id) },
    ]);
  };

  const openSidebar = async () => {
    const e = await getLoginEmail();
    setEmail(e);
    setShowSidebar(true);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowSidebar(false));
  };

  const logout = async () => {
    await clearStorage();
    router.replace("/(tabs)/LoginScreen");
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>User List</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            No users found
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              {index + 1}. {item.name} ({item.email})
            </Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => router.push("/(tabs)/AddUserScreen")}
      >
        <Text style={styles.floatingBtnText}>➕ Add User</Text>
      </TouchableOpacity>

      {showSidebar && (
        <>
          <Pressable style={styles.overlay} onPress={closeSidebar} />

          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(email || "U")[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                router.push("/(tabs)/ProfileScreen");
              }}
            >
              <Text style={styles.menuText}>👤 Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <Text style={[styles.menuText, { color: "red" }]}>
                🚪 Logout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#9fd3d6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e90ff",
    padding: 15,
  },
  menu: { fontSize: 24, color: "white", marginRight: 15 },
  title: { fontSize: 20, color: "white", fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: { fontSize: 14, flex: 1 },
  deleteBtn: {
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  floatingBtn: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  floatingBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "white",
    padding: 20,
  },
  profileBox: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 26, fontWeight: "bold" },
  profileEmail: { fontSize: 13, color: "#666" },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuText: { fontSize: 16 },
});
