import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 401: no se envió ningún token
  if (!authHeader) {
    return res.status(401).json({ message: "No se proporcionó un token de autenticación" });
  }

  const parts = authHeader.split(" ");

  // Se espera el formato "Bearer <token>"
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Formato de token inválido. Debe ser 'Bearer <token>'" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // 403: el token existe pero no es válido o expiró
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export default authMiddleware;
