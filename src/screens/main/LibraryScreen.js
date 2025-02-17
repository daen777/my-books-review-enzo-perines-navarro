import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { getAllBooks, searchBooks } from "../../services/bookService";

const LibraryScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const booksData = await getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (search.length > 0) {
      setLoading(true);
      try {
        const results = await searchBooks(search);
        setBooks(results);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
      setLoading(false);
    } else {
      fetchBooks();
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Buscar libros..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("BookDetail", { book: item })}>
              <View style={{ padding: 10, borderBottomWidth: 1 }}>
                <Text style={{ fontSize: 18 }}>{item.title}</Text>
                <Text>{item.authors?.join(", ")}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default LibraryScreen;
