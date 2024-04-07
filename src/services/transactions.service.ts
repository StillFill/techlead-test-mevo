import { Transaction } from "../models/Transaction";
import { TransactionRequest } from "../models/requests/TransactionRequest";

export const convertTransactions = (
  transactions: TransactionRequest[]
): SeparateRaw<Transaction, Transaction> => {
  let finalTransactions: Transaction[] = transactions;
  let finalInvalidTransactions: Transaction[] = [];

  const negativeSeparation = separateNegativeTransactions(transactions);

  finalTransactions = negativeSeparation.validTransactions;
  finalInvalidTransactions = negativeSeparation.invalidTransactions;

  finalTransactions = detectSuspiciousTransactions(finalTransactions);

  return {
    validTransactions: finalTransactions,
    invalidTransactions: finalInvalidTransactions,
  };
};

export const separateNegativeTransactions = (
  transactions: TransactionRequest[]
): SeparateRaw<TransactionRequest, Transaction> => {
  const validTransactions: TransactionRequest[] = [];
  const invalidTransactions: Transaction[] = [];

  transactions.forEach((transac) => {
    if (transac.amount > 0) {
      validTransactions.push(transac);
    } else {
      invalidTransactions.push({
        ...transac,
        reason: "negative",
        suspicious: false,
      });
    }
  });

  return {
    validTransactions,
    invalidTransactions,
  };
};

export const detectSuspiciousTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const formattedTransactions: Transaction[] = transactions.map((transac) => {
    const isSuspicious = transac.amount > 5000000;

    const reason = isSuspicious ? "suspicious" : undefined;

    return {
      ...transac,
      suspicious: isSuspicious,
      reason,
    };
  });

  return formattedTransactions;
};

export const generateTransactionId = (transaction: Transaction) =>
  `${transaction.to}-${transaction.from}-${transaction.amount}`;

export interface Separate<T> {
  transactions: T[];
  separatedAmount: number;
}

export interface SeparateRaw<T, IT> {
  validTransactions: T[];
  invalidTransactions: IT[];
}
