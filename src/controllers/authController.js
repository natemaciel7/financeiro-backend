import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db.js";
import { userSchema } from "../schemas/userSchema.js";

dotenv.config();

export async function signUp(req, res) {
  const { error } = userSchema.validate(req.body);
  if (error)
    return res.status(422).send(error.details.map((err) => err.message));
  const { name, email, password } = req.body;
  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(409).send("E-mail já cadastrado");

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .collection("users")
      .insertOne({ name, email, password: hashedPassword });

    res.status(201).send("Usuário cadastrado com sucesso");
  } catch (err) {
    res.status(500).send("Erro interno");
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).send("Usuário não encontrado");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send("Senha incorreta");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send("Erro interno");
  }
}
