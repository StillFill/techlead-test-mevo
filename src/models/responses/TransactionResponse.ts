import { SeparateRaw } from "../../services/transactions.service";
import { Transaction } from "../Transaction";

export interface TransactionResponse {
  invalidTransactions: Transaction[];
  validTransactionsInsertedCount: number;
}
