import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { auth, db, storage } from "../../services/firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    try {
      if (currentUser) {
        // Intentar obtener datos desde Firestore
        const booksSnapshot = await getDocs(collection(db, "favorites", currentUser.uid, "books"));
        const reviewsSnapshot = await getDocs(collection(db, "reviews", currentUser.uid, "userReviews"));

        let totalRating = 0;
        reviewsSnapshot.forEach((doc) => {
          totalRating += doc.data().rating;
        });

        const stats = {
          booksCount: booksSnapshot.size,
          reviewsCount: reviewsSnapshot.size,
          averageRating: reviewsSnapshot.size > 0 ? (totalRating / reviewsSnapshot.size).toFixed(1) : 0,
        };

        // Guardar datos en AsyncStorage (caché local)
        await AsyncStorage.setItem("profileStats", JSON.stringify(stats));

        setBooksCount(stats.booksCount);
        setReviewsCount(stats.reviewsCount);
        setAverageRating(stats.averageRating);
      }
    } catch (error) {
      // Si hay error (sin conexión), cargar datos desde AsyncStorage
      const cachedStats = await AsyncStorage.getItem("profileStats");
      if (cachedStats) {
        const stats = JSON.parse(cachedStats);
        setBooksCount(stats.booksCount);
        setReviewsCount(stats.reviewsCount);
        setAverageRating(stats.averageRating);
      }
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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.title}>Perfil</Text>
          {user && (
            <>
              <Image
                source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
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
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  email: { fontSize: 16, marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5 },
  updateButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginBottom: 10 },
  button: { padding: 10, borderRadius: 5, marginTop: 10, width: "80%", alignItems: "center" },
  logoutButton: { backgroundColor: "red" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  statsContainer: { marginTop: 20, alignItems: "center" },
  statText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
});
