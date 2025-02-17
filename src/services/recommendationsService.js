// import { db, auth } from "../firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { getBooks } from "./booksService";

// export const getRecommendedBooks = async () => {
//   if (!auth.currentUser) return [];

//   try {
//     // 🔹 Obtener todas las reseñas del usuario
//     const userReviewsQuery = query(
//       collection(db, "libros"),
//       where("reseñas.usuarioId", "==", auth.currentUser.uid)
//     );
//     const userReviewsSnapshot = await getDocs(userReviewsQuery);

//     let favoriteGenres = {}; // Contador de géneros favoritos

//     userReviewsSnapshot.forEach((doc) => {
//       const book = doc.data();
//       const genre = book.genre || "Desconocido";
//       favoriteGenres[genre] = (favoriteGenres[genre] || 0) + 1;
//     });

//     // 🔹 Encontrar el género más reseñado por el usuario
//     const topGenre = Object.keys(favoriteGenres).reduce((a, b) =>
//       favoriteGenres[a] > favoriteGenres[b] ? a : b
//     );

//     // 🔹 Obtener todos los libros y filtrar los del género favorito
//     const allBooks = await getBooks();
//     const recommendedBooks = allBooks.filter((book) => book.genre === topGenre);

//     return recommendedBooks;
//   } catch (error) {
//     console.error("Error al obtener recomendaciones:", error);
//     return [];
//   }
// };
