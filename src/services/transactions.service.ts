import { Transaction } from "../models/Transaction";
import { TransactionRequest } from "../models/requests/TransactionRequest";

export const convertTransactions = (
  transactions: TransactionRequest[]
): Separate<Transaction> => {
  let finalTransactions = transactions;
  let invalidAmount = 0;

  const negativeSeparation = separateNegativeTransactions(transactions);

  finalTransactions = negativeSeparation.transactions;
  invalidAmount += negativeSeparation.separatedAmount;

  finalTransactions = detectSuspiciousTransactions(finalTransactions);

  return {
    transactions: finalTransactions,
    separatedAmount: invalidAmount,
  };
};

export const separateNegativeTransactions = (
  transactions: TransactionRequest[]
): Separate<TransactionRequest> => {
  const beforeSeparateLength = transactions.length;

  const separatedTransactions = transactions.filter((a) => a.amount > 0);

  return {
    transactions: separatedTransactions,
    separatedAmount: beforeSeparateLength - separatedTransactions.length,
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

export interface Separate<T> {
  transactions: T[];
  separatedAmount: number;
}
