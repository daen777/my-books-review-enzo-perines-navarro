// import { db, auth } from "../firebase";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
// import { storage } from "../firebase";

// /**
//  * Sube la imagen de perfil a Firebase Storage y guarda la URL en Firestore.
//  * @param {string} uri - URI de la imagen seleccionada.
//  * @returns {Promise<string>} - URL de la imagen subida.
//  */
// export const uploadProfilePicture = async (uri) => {
//   try {
//     const user = auth.currentUser;
//     if (!user) throw new Error("Usuario no autenticado");

//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);
//     await uploadBytes(storageRef, blob);

//     const downloadURL = await getDownloadURL(storageRef);

//     const userRef = doc(db, "users", user.uid);
//     await updateDoc(userRef, { photoURL: downloadURL });

//     return downloadURL;
//   } catch (error) {
//     console.error("Error al subir imagen:", error);
//     return null;
//   }
// };

// /**
//  * Obtiene estadísticas del usuario: libros guardados y reseñas escritas.
//  * @returns {Promise<Object>} - Datos de estadísticas.
//  */
// export const getUserStats = async () => {
//   try {
//     const user = auth.currentUser;
//     if (!user) throw new Error("Usuario no autenticado");

//     // Contar libros guardados
//     const booksRef = collection(db, "users", user.uid, "misLibros");
//     const booksSnapshot = await getDocs(booksRef);
//     const booksSaved = booksSnapshot.size;

//     // Contar reseñas escritas
//     const reviewsRef = collection(db, "reviews");
//     const reviewsQuery = query(reviewsRef, where("userId", "==", user.uid));
//     const reviewsSnapshot = await getDocs(reviewsQuery);
//     const reviewsCount = reviewsSnapshot.size;

//     return { booksSaved, reviewsCount };
//   } catch (error) {
//     console.error("Error al obtener estadísticas:", error);
//     return { booksSaved: 0, reviewsCount: 0 };
//   }
// };
