import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// Obtener estadísticas de reseñas del usuario
export const getUserStats = async (userId) => {
  try {
    const q = query(collection(db, "reviews"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const totalReviews = querySnapshot.size;
    let totalRating = 0;

    querySnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
    });

    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "N/A";

    return { totalReviews, averageRating };
  } catch (error) {
    throw error;
  }
};
