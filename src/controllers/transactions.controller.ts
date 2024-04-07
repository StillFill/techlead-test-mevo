import { Response } from "express";
import csv from "csvtojson";
import {
  convertTransactions,
  generateTransactionId,
} from "../services/transactions.service";
import {
  uploadInvalidTransactions,
  uploadTransactions,
} from "../repositories/transactionRepository";
import { TransactionResponse } from "../models/responses/TransactionResponse";
import { Transaction } from "../models/Transaction";
import { v4 as uuid } from "uuid";

// OBS
// Em todo esse processo eu adicionaria a utilização de transactions (do MongoDB) para poder ter um rollback caso tenha problema processando algo
// Algo que poderia acontecer é inserir apenas as validas, dar erro para inserir as invalidas e ficar com divergencia
// Então adicionaria uma transação unica para todos os inserts e caso dê erro, retornar na API que não foi possivel processar o arquivo e dar rollback na transaction
export const uploadFile = async (req: any, res: Response) => {
  let transactions;

  try {
    transactions = await csv({
      delimiter: ";",
    }).fromFile(req.file.path);
  } catch (err) {
    return res.status(400).send("Não foi possivel converter o arquivo");
  }

  try {
    if (!transactions) throw new Error();

    const buildedTransactions = buildTransactions(
      transactions,
      req.file.originalname
    );

    const convertedTransactions = convertTransactions(buildedTransactions);

    const { notInsertedTransactions, insertedTransactions } =
      await uploadTransactions(convertedTransactions.validTransactions);

    const finalInvalidTransactions = [
      ...convertedTransactions.invalidTransactions,
      ...notInsertedTransactions,
    ];

    await uploadInvalidTransactions(finalInvalidTransactions);

    const response: TransactionResponse = {
      validTransactionsInsertedCount: insertedTransactions.length,
      invalidTransactions: finalInvalidTransactions,
    };

    return res.json(response);
  } catch (err) {
    // OBS
    // não trataria os erros diretamente aqui na controller
    // gosto de utilizar GlobalErrorHandler
    // então eu iria criar algumas exceptions para cada cenario de erro
    // basicamente seguindo essa logica: https://javascript.info/custom-errors
    // e no GlobalErrorHandler iria lidar com cada exception e caso chegue uma exception padrão, retornaria erro 500, para as outras, padronizaria dependendo do tipo
    return res
      .status(500)
      .send("Não foi possivel processar o arquivo por completo");
  }
};

const buildTransactions = (transactions: Transaction[], fileName: string) => {
  const fileId = uuid();

  return transactions.map((transac) => ({
    ...transac,
    file_name: fileName,
    file_id: fileId,
    transaction_id: generateTransactionId(transac),
  }));
};
