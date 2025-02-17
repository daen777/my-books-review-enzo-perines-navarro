import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { auth } from "./firebaseConfig";

const storage = getStorage();

// Función para seleccionar una imagen desde la galería
export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Cuadrado
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

// Función para subir la imagen a Firebase Storage
export const uploadProfilePicture = async (uri) => {
  if (!auth.currentUser) {
    throw new Error("No hay usuario autenticado");
  }

  const userId = auth.currentUser.uid;
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `profile_pictures/${userId}`);

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
