import { TransactionRequest } from "./requests/TransactionRequest";

export interface Transaction extends TransactionRequest {
  suspicious?: Boolean;
  file_name?: string;
  file_id?: string; // UUID
  reason?: string;
  transaction_id?: string;
}
