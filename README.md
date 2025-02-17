# 📚 My Books Review - Enzo Perines Navarro  

My Books Review es una aplicación móvil desarrollada en **React Native + Expo** que permite a los usuarios **buscar libros, agregarlos a favoritos y escribir reseñas con calificación por estrellas**.  

## 🚀 Características  
✅ Registro e inicio de sesión con Firebase.  
✅ Búsqueda de libros usando la API de Udacity Books.  
✅ Guardado de libros en favoritos.  
✅ Creación, edición y eliminación de reseñas con calificación por estrellas.  
✅ Gestión de perfil con cambio de foto y estadísticas de lectura.  
✅ Soporte para modo offline con almacenamiento en caché.  

---

## 🛠️ **Requisitos Previos**  
Antes de instalar el proyecto, asegúrate de tener:  

- [Node.js](https://nodejs.org/) (versión 16 o superior)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado globalmente  
- Un editor de código (VS Code recomendado)  
- Expo Go en tu dispositivo móvil para probar la app  

---

## 🏗 **Instalación y Uso**  

1️⃣ **Clonar el repositorio**  

git clone https://github.com/daen777/trabajo-final-my-books-review-enzo-perines-navarro.git
cd trabajo-final-my-books-review-enzo-perines-navarro

2️⃣ Instalar dependencias

npm install

3️⃣ Configurar Firebase

Crea un proyecto en Firebase Console.
Agrega un archivo firebaseConfig.js en src/services/ con tu configuración de Firebase.
Habilita autenticación con email/password y Firestore en Firebase.

4️⃣ Ejecutar la app

npx expo start

Para probar en un dispositivo físico, escanea el código QR con la app Expo Go.
Para probar en un emulador, selecciona Run on Android Emulator o Run on iOS Simulator.

🔧 Tecnologías Utilizadas
React Native (Framework principal)
Expo (Para desarrollo rápido y testing)
Firebase Authentication (Registro e inicio de sesión)
Firebase Firestore (Base de datos para reseñas y favoritos)
Firebase Storage (Almacenamiento de fotos de perfil)
Udacity Books API (Fuente de datos de libros)


👨‍💻 Autor
📌 Enzo Perines Navarro

📜 Licencia
Este proyecto está bajo la licencia MIT. Puedes modificarlo y distribuirlo libremente.
