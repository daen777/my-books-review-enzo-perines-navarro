import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { getAllBooks, searchBooks, addReview, getReviews, addBookToFavorites, removeBookFromFavorites } from "../../services/booksAPI";

export default function LibraryScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await getAllBooks();
    setBooks(data);
    setLoading(false);
  };

  const openReviewModal = async (book) => {
    setSelectedBook(book);
    setModalVisible(true);
    const bookReviews = await getReviews(book.id);
    setReviews(bookReviews);
  };

  const submitReview = async () => {
    if (!reviewText.trim()) return;

    const success = await addReview(selectedBook.id, reviewText, rating);
    if (success) {
      setReviewText("");
      setRating(5);
      setModalVisible(false);
      openReviewModal(selectedBook);
    }
  };

  const handleFavorite = async (book) => {
    const success = await addBookToFavorites(book);
    if (success) {
      alert("Libro agregado a favoritos! 📚");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca 📚</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar libros..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Image source={{ uri: item.imageLinks?.thumbnail }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.authors?.join(", ")}</Text>

                {/* Botón para ver o agregar reseñas */}
                <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(item)}>
                  <Text style={styles.buttonText}>📝 Ver/Agregar Reseña</Text>
                </TouchableOpacity>

                {/* Botón para agregar a favoritos */}
                <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavorite(item)}>
                  <Text style={styles.buttonText}>⭐ Agregar a Favoritos</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal de Reseñas */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{selectedBook?.title}</Text>

          {/* Mostrar reseñas existentes */}
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.reviewId}
            renderItem={({ item }) => (
              <Text>⭐ {item.rating} - {item.reviewText}</Text>
            )}
          />

          {/* Selección de estrellas */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => setRating(num)}>
                <Text style={[styles.star, rating >= num ? styles.starSelected : styles.starUnselected]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input para la reseña */}
          <TextInput
            placeholder="Escribe tu reseña..."
            value={reviewText}
            onChangeText={setReviewText}
            style={styles.input}
          />

          {/* Botón para enviar la reseña */}
          <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
            <Text style={styles.buttonText}>Enviar Reseña</Text>
          </TouchableOpacity>

          {/* Botón para cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text>❌ Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  searchBar: { height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 10 },
  bookItem: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  bookImage: { width: 50, height: 75, marginRight: 10 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: "bold" },
  bookAuthor: { fontSize: 14, color: "#555" },
  reviewButton: { backgroundColor: "#007bff", padding: 5, borderRadius: 5, marginTop: 5 },
  favoriteButton: { backgroundColor: "#f4b400", padding: 5, borderRadius: 5, marginTop: 5 },
  buttonText: { color: "white", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  modalView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "white" },
  starsContainer: { flexDirection: "row", marginBottom: 10 },
  star: { fontSize: 30, marginHorizontal: 5 },
  starSelected: { color: "#ffd700" },
  starUnselected: { color: "#ccc" },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, backgroundColor: "#fff" },
  submitButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginBottom: 10 },
  closeButton: { padding: 10, backgroundColor: "red", borderRadius: 5 },
});
