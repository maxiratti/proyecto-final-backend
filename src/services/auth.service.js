import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Login "simple": valida contra las credenciales definidas en el .env
// (en un proyecto real, esto consultaría una base de datos de usuarios)
const login = async (username, password) => {
  const isValidUser =
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD;

  if (!isValidUser) {
    const error = new Error("Usuario o contraseña incorrectos");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return token;
};

export default { login };
