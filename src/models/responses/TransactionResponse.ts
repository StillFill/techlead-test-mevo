import { Separate } from "../../services/transactions.service";
import { Transaction } from "../Transaction";

export interface TransactionResponse extends Separate<Transaction> {
  insertedAmount: number;
}
