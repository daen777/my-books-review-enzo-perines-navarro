// src/services/authService.js
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Registrar usuario
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("user");
  } catch (error) {
    throw error;
  }
};
