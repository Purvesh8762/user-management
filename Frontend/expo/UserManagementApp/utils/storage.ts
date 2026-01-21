import AsyncStorage from "@react-native-async-storage/async-storage";

// Save token
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem("token", token);
};

// Get token
export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// Remove token
export const removeToken = async () => {
  await AsyncStorage.removeItem("token");
};

// Save admin id
export const saveAdminId = async (id: number) => {
  await AsyncStorage.setItem("adminId", id.toString());
};

export const getAdminId = async () => {
  const id = await AsyncStorage.getItem("adminId");
  return id ? Number(id) : null;
};

// Save email
export const saveLoginEmail = async (email: string) => {
  await AsyncStorage.setItem("email", email);
};

export const getLoginEmail = async () => {
  return await AsyncStorage.getItem("email");
};

// Clear all
export const clearStorage = async () => {
  await AsyncStorage.clear();
};
