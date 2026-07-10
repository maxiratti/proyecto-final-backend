import authService from "../services/auth.service.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Debes enviar 'username' y 'password'" });
    }

    const token = await authService.login(username, password);

    res.status(200).json({
      message: "Login exitoso",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    next(error);
  }
};

export default { login };
