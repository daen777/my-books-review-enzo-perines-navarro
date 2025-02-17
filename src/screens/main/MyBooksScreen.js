// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
// import { db, auth } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";

// const MyBooksScreen = ({ navigation }) => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const booksRef = collection(db, "users", user.uid, "misLibros");
//       const querySnapshot = await getDocs(booksRef);
//       setBooks(querySnapshot.docs.map((doc) => doc.data()));
//     };

//     fetchBooks();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📖 Mis Libros</Text>
//       <FlatList
//         data={books}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => navigation.navigate("BookDetails", { book: item })}>
//             <Image source={{ uri: item.cover }} style={styles.bookImage} />
//             <Text>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({ container: { flex: 1, padding: 10 }, title: { fontSize: 24, fontWeight: "bold", textAlign: "center" }, bookImage: { width: 80, height: 120, marginRight: 10 } });

// export default MyBooksScreen;
