import { db, auth } from "./firebaseConfig";
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, updateDoc } from "firebase/firestore";

const API_URL = "https://reactnd-books-api.udacity.com";
const HEADERS = { Authorization: "12345", "Content-Type": "application/json" };

/**
 * Obtener todos los libros de la API de Udacity Books.
 */
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`, { headers: HEADERS });
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error("Error obteniendo libros:", error);
    return [];
  }
};

/**
 * Buscar libros en la API de Udacity Books según un término de búsqueda.
 * @param {string} query - El término de búsqueda.
 */
export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.books || [];
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return [];
  }
};

/**
 * Agregar un libro a favoritos en Firestore.
 * @param {object} book - Objeto del libro a agregar.
 */
export const addBookToFavorites = async (book) => {
  const user = auth.currentUser;
  if (!user) return false;

  const bookRef = doc(db, "favorites", user.uid, "books", book.id);
  try {
    await setDoc(bookRef, book);
    return true;
  } catch (error) {
    console.error("Error al guardar el libro en favoritos:", error);
    return false;
  }
};

/**
 * Eliminar un libro de favoritos en Firestore.
 * @param {string} bookId - ID del libro a eliminar.
 */
export const removeBookFromFavorites = async (bookId) => {
  const user = auth.currentUser;
  if (!user) return false;

  const bookRef = doc(db, "favorites", user.uid, "books", bookId);
  try {
    await deleteDoc(bookRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar el libro de favoritos:", error);
    return false;
  }
};

/**
 * Obtener la lista de libros favoritos del usuario desde Firestore.
 */
export const getFavoriteBooks = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const querySnapshot = await getDocs(collection(db, "favorites", user.uid, "books"));
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error obteniendo libros favoritos:", error);
    return [];
  }
};

/**
 * Agregar una reseña a un libro en Firestore.
 * @param {string} bookId - ID del libro.
 * @param {string} reviewText - Texto de la reseña.
 * @param {number} rating - Calificación del 1 al 5.
 */
export const addReview = async (bookId, reviewText, rating) => {
  const user = auth.currentUser;
  if (!user) return false;

  const reviewRef = doc(collection(db, "reviews", bookId, "userReviews"));
  try {
    await setDoc(reviewRef, {
      reviewId: reviewRef.id,
      bookId,
      userId: user.uid,
      userName: user.displayName || "Usuario Anónimo",
      reviewText,
      rating,
      timestamp: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error al agregar reseña:", error);
    return false;
  }
};

/**
 * Obtener todas las reseñas de un libro.
 * @param {string} bookId - ID del libro.
 */
export const getReviews = async (bookId) => {
  try {
    const reviewsQuery = query(collection(db, "reviews", bookId, "userReviews"));
    const querySnapshot = await getDocs(reviewsQuery);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error obteniendo reseñas:", error);
    return [];
  }
};

/**
 * Editar una reseña en Firestore.
 * @param {string} bookId - ID del libro.
 * @param {string} reviewId - ID de la reseña.
 * @param {string} newReviewText - Nuevo texto de la reseña.
 * @param {number} newRating - Nueva calificación.
 */
export const editReview = async (bookId, reviewId, newReviewText, newRating) => {
  const user = auth.currentUser;
  if (!user) return false;

  const reviewRef = doc(db, "reviews", bookId, "userReviews", reviewId);
  try {
    await updateDoc(reviewRef, {
      reviewText: newReviewText,
      rating: newRating,
    });
    return true;
  } catch (error) {
    console.error("Error al editar reseña:", error);
    return false;
  }
};

/**
 * Eliminar una reseña en Firestore.
 * @param {string} bookId - ID del libro.
 * @param {string} reviewId - ID de la reseña.
 */
export const deleteReview = async (bookId, reviewId) => {
  const user = auth.currentUser;
  if (!user) return false;

  const reviewRef = doc(db, "reviews", bookId, "userReviews", reviewId);
  try {
    await deleteDoc(reviewRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    return false;
  }
};
