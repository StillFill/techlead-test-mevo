import { Response } from "express";
import csv from "csvtojson";
import { convertTransactions } from "../services/transactions.service";
import { uploadTransactions } from "../repositories/transactionRepository";
import { TransactionResponse } from "../models/responses/TransactionResponse";

export const uploadFile = async (req: any, res: Response) => {
  console.log(req.file);

  let transactions;

  try {
    transactions = await csv({
      delimiter: ";",
    }).fromFile(req.file.path);
  } catch (err) {
    res.status(400).send("Não foi possivel converter o arquivo");
  }

  try {
    if (!transactions) throw new Error();

    const convertedTransactions = convertTransactions(transactions);

    const { notInsertedTransactions, insertedTransactions } =
      await uploadTransactions(convertedTransactions.transactions);

    convertedTransactions.separatedAmount += notInsertedTransactions.length;

    const response: TransactionResponse = {
      separatedAmount: convertedTransactions.separatedAmount,
      transactions: insertedTransactions,
      insertedAmount: insertedTransactions.length,
    };

    return res.json(response);
  } catch (err) {
    console.log("ERRO INSERÇÃO: ", err);
  }

  return res.sendStatus(200);
};
