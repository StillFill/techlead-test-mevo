import { Transaction } from "../models/Transaction";
import TransactionModel from "../db/schemas/transactionSchema";

export const uploadTransactions = async (
  transactions: Transaction[]
): Promise<InsertedData> => {
  const transactionsToInsert = buildTransactionsIds(transactions);
  console.log("INSERT");

  const insertedTransactions: Transaction[] = [];
  const notInsertedTransactions: Transaction[] = [];

  console.log("transactionsToInsert: ", transactionsToInsert);

  for (let i = 0; i < transactionsToInsert.length - 1; i++) {
    try {
      await TransactionModel.collection.insertOne(transactionsToInsert[i]);
      insertedTransactions.push(transactionsToInsert[i]);
    } catch (err) {
      notInsertedTransactions.push(transactionsToInsert[i]);
    }
  }

  return { insertedTransactions, notInsertedTransactions };
};

const buildTransactionsIds = (transactions: Transaction[]) => {
  return transactions.map((transac) => ({
    ...transac,
    transaction_id: generateTransactionId(transac),
  }));
};

const generateTransactionId = (transaction: Transaction) =>
  `${transaction.to}-${transaction.from}-${transaction.amount}`;

export interface InsertedData {
  notInsertedTransactions: Transaction[];
  insertedTransactions: Transaction[];
}
