import { Transaction } from "../models/Transaction";
import TransactionModel from "../db/schemas/transactionSchema";
import InvalidTransactionModel from "../db/schemas/invalidTransactionSchema";

// OBS
// Nesse caso normalmente eu não criaria testes unitarios para a parte de repository já que a camada de service ja trata todos os dados
// MAS eu criaria para esse cenário de erro no insert ja que para nosso cenário esse comportamento de disparar erro é importante para descobrir os duplicados
export const uploadTransactions = async (
  transactions: Transaction[]
): Promise<InsertedData> => {
  const insertedTransactions: Transaction[] = [];
  const notInsertedTransactions: Transaction[] = [];

  for (let i = 0; i < transactions.length - 1; i++) {
    try {
      await TransactionModel.collection.insertOne(transactions[i]);
      insertedTransactions.push(transactions[i]);
    } catch (err) {
      notInsertedTransactions.push({
        ...transactions[i],
        reason: "duplicated",
      });
    }
  }

  return { insertedTransactions, notInsertedTransactions };
};

export const uploadInvalidTransactions = async (
  transactions: Transaction[]
): Promise<void> => {
  for (let i = 0; i <= transactions.length - 1; i++) {
    await InvalidTransactionModel.collection.insertOne(transactions[i]);
  }
};

export interface InsertedData {
  notInsertedTransactions: Transaction[];
  insertedTransactions: Transaction[];
}
