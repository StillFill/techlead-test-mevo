import { TransactionRequest } from "./requests/TransactionRequest";

export interface Transaction extends TransactionRequest {
  suspicious?: Boolean;
  // file_id?: string; // Uuid
  reason?: string;
  transaction_id?: string;
}
