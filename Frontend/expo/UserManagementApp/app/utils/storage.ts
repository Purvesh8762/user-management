import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveLoginEmail = async (email: string) => {
  await AsyncStorage.setItem("loginEmail", email);
};

export const saveAdminId = async (id: number) => {
  await AsyncStorage.setItem("adminId", id.toString());
};

export const saveAdminName = async (name: string) => {
  await AsyncStorage.setItem("adminName", name);
};

export const getLoginEmail = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("loginEmail");
};

export const getAdminId = async (): Promise<number | null> => {
  const id = await AsyncStorage.getItem("adminId");
  return id ? Number(id) : null;
};

export const clearLoginEmail = async () => {
  await AsyncStorage.removeItem("loginEmail");
  await AsyncStorage.removeItem("adminId");
};
