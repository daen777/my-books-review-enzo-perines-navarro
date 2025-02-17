import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ActivityIndicator } from "react-native";
import { pickImage, uploadProfilePicture } from "../../services/storageService";
import { getUserStats } from "../../services/reviewsService";
import { auth } from "../../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: "N/A" });

  useEffect(() => {
    loadProfilePicture();
    fetchStats();
  }, []);

  const loadProfilePicture = async () => {
    const savedPic = await AsyncStorage.getItem(`profile_${auth.currentUser.uid}`);
    if (savedPic) {
      setProfilePic(savedPic);
    }
  };

  const fetchStats = async () => {
    try {
      if (auth.currentUser) {
        const statsData = await getUserStats(auth.currentUser.uid);
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
    }
  };

  const handleUpload = async () => {
    try {
      const imageUri = await pickImage();
      if (!imageUri) return;

      setLoading(true);
      const downloadURL = await uploadProfilePicture(imageUri);
      setProfilePic(downloadURL);
      await AsyncStorage.setItem(`profile_${auth.currentUser.uid}`, downloadURL);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Perfil</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Image
          source={profilePic ? { uri: profilePic } : require("../../../assets/icon.png")}
          style={{ width: 150, height: 150, borderRadius: 75, marginTop: 20 }}
        />
      )}

      <Button title="Cambiar Foto de Perfil" onPress={handleUpload} />

      {/* Mostrar estadísticas de lectura */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Estadísticas de Lectura</Text>
        <Text>📚 Reseñas escritas: {stats.totalReviews}</Text>
        <Text>⭐ Calificación promedio: {stats.averageRating}</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
