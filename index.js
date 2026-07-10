import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import productsRoutes from "./src/routes/products.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import errorHandlerMiddleware from "./src/middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---
app.use(cors()); // Habilita peticiones de origen cruzado (CORS)
app.use(bodyParser.json()); // Interpreta los bodies en formato JSON

// --- Rutas ---
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);

// Ruta de prueba/salud del servidor
app.get("/", (req, res) => {
  res.status(200).json({ message: "API de productos funcionando correctamente 🚀" });
});

// --- Middleware para rutas no encontradas (404) ---
// Se coloca DESPUÉS de todas las rutas válidas
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada` });
});

// --- Middleware global de manejo de errores (400 / 401 / 403 / 500) ---
// Siempre al final
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
