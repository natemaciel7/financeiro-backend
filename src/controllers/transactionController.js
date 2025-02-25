import { db } from "../db.js";
import { ObjectId } from "mongodb";

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
export async function editTransaction(req, res) {
  const { id } = req.params;
  const { value, description, type } = req.body;
  const userId = req.userId;

  try {
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(id) });

    if (!transaction) return res.status(404).send("Transação não encontrada");
    if (transaction.userId !== userId)
      return res.status(401).send("Não autorizado");

    if (!["deposit", "withdraw"].includes(type) || value <= 0) {
      return res.status(422).send("Dados inválidos");
    }

    await db
      .collection("transactions")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { value, description, type } }
      );

    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Erro interno do servidor");
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
export async function deleteTransaction(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(id) });

    if (!transaction) return res.status(404).send("Transação não encontrada");
    if (transaction.userId !== userId)
      return res.status(403).send("Acesso negado");

    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Erro interno do servidor");
  }
}
