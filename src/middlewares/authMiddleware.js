import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token não enviado");

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).send("Token inválido");
  }
}
