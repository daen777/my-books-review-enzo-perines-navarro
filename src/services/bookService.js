// src/services/bookService.js
const API_URL = "https://reactnd-books-api.udacity.com";

const headers = {
  Authorization: "your_unique_token", // Reemplaza con tu token único
};

// Obtener todos los libros
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`, { headers });
    const data = await response.json();
    return data.books;
  } catch (error) {
    throw error;
  }
};

// Buscar libros por término
export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.books || [];
  } catch (error) {
    throw error;
  }
};
