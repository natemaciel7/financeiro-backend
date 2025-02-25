import { db } from "../db.js";
import { ObjectId } from "mongodb";
import { transactionSchema } from "../schemas/transactionSchema.js";

export async function addTransaction(req, res) {
  const { error } = transactionSchema.validate(req.body);
  if (error)
    return res.status(422).send(error.details.map((err) => err.message));

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
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const transactions = await db
      .collection("transactions")
      .find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
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
