import AsyncStorage from "@react-native-async-storage/async-storage";

// Save logged-in admin email
export const saveLoginEmail = async (email: string) => {
  await AsyncStorage.setItem("loginEmail", email);
};

// Save admin id
export const saveAdminId = async (id: number) => {
  await AsyncStorage.setItem("adminId", id.toString());
};

// Get logged-in admin email
export const getLoginEmail = async () => {
  return await AsyncStorage.getItem("loginEmail");
};

// Get admin id (convert from string to number)
export const getAdminId = async () => {
  const id = await AsyncStorage.getItem("adminId");
  return id ? Number(id) : null;
};

// Clear login session (logout)
export const clearLoginEmail = async () => {
  await AsyncStorage.removeItem("loginEmail");
  await AsyncStorage.removeItem("adminId");
};
