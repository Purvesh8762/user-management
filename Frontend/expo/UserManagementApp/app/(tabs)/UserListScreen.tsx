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
  clearLoginEmail,
  getLoginEmail,
  getAdminId,
} from "../utils/storage";

// Backend API
const API = "http://10.193.30.67:8082/api";

// Screen width for sidebar animation
const SCREEN_WIDTH = Dimensions.get("window").width;

// User object type
type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserListScreen() {
  const router = useRouter();

  // Sidebar animation value
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // UI states
  const [showSidebar, setShowSidebar] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Reload users whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  // Load users from backend
  const loadUsers = async () => {
    const adminId = await getAdminId();

    if (!adminId) {
      router.replace("/(tabs)/LoginScreen");
      return;
    }

    try {
      const res = await fetch(`${API}/users/list/${adminId}`);
      const data = await res.json();

      // Ensure array response
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Error", "Unable to load users");
    }
  };

  // Confirm delete popup
  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteUser(id) },
      ]
    );
  };

  // Delete user API call
  const deleteUser = async (id: number) => {
    try {
      await fetch(`${API}/users/delete/${id}`, {
        method: "DELETE",
      });

      Alert.alert("Success", "User deleted successfully");
      loadUsers();
    } catch {
      Alert.alert("Error", "Unable to delete user");
    }
  };

  // Open sidebar
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

  // Close sidebar
  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowSidebar(false));
  };

  // Logout admin
  const logout = async () => {
    await clearLoginEmail();
    router.replace("/(tabs)/LoginScreen");
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>User List</Text>
      </View>

      {/* USER LIST */}
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

      {/* ADD USER BUTTON */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => router.push("/(tabs)/AddUserScreen")}
      >
        <Text style={styles.floatingBtnText}>➕ Add User</Text>
      </TouchableOpacity>

      {/* SIDEBAR */}
      {showSidebar && (
        <>
          {/* Dark overlay */}
          <Pressable style={styles.overlay} onPress={closeSidebar} />

          {/* Sliding sidebar */}
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <View style={styles.profileBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(email || "U")[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            {/* Profile */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                router.push("/(tabs)/ProfileScreen");
              }}
            >
              <Text style={styles.menuText}>👤 Profile</Text>
            </TouchableOpacity>

            {/* Register another account */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                router.replace("/(tabs)/RegisterScreen");
              }}
            >
              <Text style={styles.menuText}>➕ Add Another Account</Text>
            </TouchableOpacity>

            {/* Logout */}
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

// UI styles
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

  text: { fontSize: 14, flex: 1, marginRight: 10 },

  deleteBtn: {
    backgroundColor: "red",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },

  floatingBtn: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },

  floatingBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "white",
    padding: 20,
    zIndex: 20,
  },

  profileBox: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  profileEmail: {
    fontSize: 13,
    color: "#666",
  },

  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  menuText: {
    fontSize: 16,
  },
});
