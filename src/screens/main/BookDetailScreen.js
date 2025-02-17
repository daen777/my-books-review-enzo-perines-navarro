import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { addReview, getReviewsByBook } from "../../services/reviewsService";
import { auth } from "../../services/firebaseConfig";

const BookDetailScreen = ({ route }) => {
  const { book } = route.params;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("5"); // Valor predeterminado de 5 estrellas
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsData = await getReviewsByBook(book.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert("Error", "Escribe un comentario antes de enviar.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión para agregar una reseña.");
        return;
      }

      await addReview(book.id, user.uid, user.email, parseInt(rating), reviewText);
      setReviewText("");
      setRating("5");
      fetchReviews(); // Refrescar lista de reseñas
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la reseña.");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{book.title}</Text>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Tu Reseña:</Text>
      <TextInput
        placeholder="Escribe tu reseña aquí..."
        value={reviewText}
        onChangeText={setReviewText}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Puntuación (1-5):</Text>
      <TextInput
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 50 }}
      />

      <Button title={loading ? "Enviando..." : "Agregar Reseña"} onPress={handleAddReview} disabled={loading} />

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>Reseñas:</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.userName}</Text>
            <Text>🌟 {item.rating}/5</Text>
            <Text>{item.reviewText}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BookDetailScreen;
