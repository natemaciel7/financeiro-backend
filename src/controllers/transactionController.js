import { db } from "../db.js";

export async function addTransaction(req, res) {
  const { value, description, type } = req.body;
  const userId = req.userId;

  try {
    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(422).send("Tipo inválido");
    }

    await db.collection("transactions").insertOne({
      userId,
      value,
      description,
      type,
      date: new Date(),
    });

    res.status(201).send("Transação registrada");
  } catch (err) {
    res.status(500).send("Erro interno");
  }
}

export async function getTransactions(req, res) {
  const userId = req.userId;

  try {
    const transactions = await db
      .collection("transactions")
      .find({ userId })
      .sort({ date: -1 })
      .toArray();
    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send("Erro interno");
  }
}
