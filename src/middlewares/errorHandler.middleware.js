// Middleware global de manejo de errores.
// Se coloca al final de todas las rutas en index.js.
// Cualquier "next(error)" de los controladores termina acá.
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error("Error capturado:", err.message);

  // Si el error tiene un statusCode definido (400, 401, 403, 404, etc.) lo usamos
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500
      ? "Error interno del servidor. Intenta nuevamente más tarde."
      : err.message;

  res.status(statusCode).json({
    error: true,
    status: statusCode,
    message,
  });
};

export default errorHandlerMiddleware;
