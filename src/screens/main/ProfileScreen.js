import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { auth, db, storage } from "../../services/firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [booksCount, setBooksCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;
    setUser(currentUser);
    setName(currentUser.displayName || "");

    if (currentUser) {
      // Contar libros favoritos
      const booksSnapshot = await getDocs(collection(db, "favorites", currentUser.uid, "books"));
      setBooksCount(booksSnapshot.size);

      // Obtener reseñas del usuario
      const reviewsSnapshot = await getDocs(collection(db, "reviews", currentUser.uid, "userReviews"));
      setReviewsCount(reviewsSnapshot.size);

      // Calcular promedio de calificación
      let totalRating = 0;
      reviewsSnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
      });
      setAverageRating(reviewsSnapshot.size > 0 ? (totalRating / reviewsSnapshot.size).toFixed(1) : 0);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setUser({ ...user, displayName: name });
      Alert.alert("Éxito", "Nombre actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      setUser({ ...user, photoURL: downloadURL });

      Alert.alert("Éxito", "Foto de perfil actualizada.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la foto de perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.title}>Perfil</Text>
          {user && (
            <>
              {/* Contenedor Circular Tocable */}
              <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                <Image
                  source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
                  style={styles.profileImage}
                />
                <Text style={styles.changePhotoText}>📷 Cambiar Foto</Text>
              </TouchableOpacity>

              <Text style={styles.email}>{user.email}</Text>

              {/* Editar Nombre */}
              <TextInput
                style={styles.input}
                placeholder="Editar Nombre"
                value={name}
                onChangeText={setName}
              />
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Actualizar Nombre</Text>
              </TouchableOpacity>

              {/* Estadísticas de lectura */}
              <View style={styles.statsContainer}>
                <Text style={styles.statText}>📚 Libros favoritos: {booksCount}</Text>
                <Text style={styles.statText}>📝 Reseñas escritas: {reviewsCount}</Text>
                <Text style={styles.statText}>⭐ Calificación promedio: {averageRating}</Text>
              </View>

              {/* Botón para cerrar sesión */}
              <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  
  /* Estilo del Contenedor Circular */
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 60,
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  /* Estilo de la Imagen de Perfil */
  profileImage: { width: 100, height: 100, borderRadius: 50 },

  /* Texto "Cambiar Foto" */
  changePhotoText: { fontSize: 12, color: "#007bff", marginTop: 5 },

  email: { fontSize: 16, marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5 },
  updateButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginBottom: 10 },
  button: { padding: 10, borderRadius: 5, marginTop: 10, width: "80%", alignItems: "center" },
  logoutButton: { backgroundColor: "red" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  statsContainer: { marginTop: 20, alignItems: "center" },
  statText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
});
