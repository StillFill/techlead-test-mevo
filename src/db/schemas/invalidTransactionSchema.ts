import mongoose from "mongoose";

const InvalidTransactionSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  suspicious: {
    type: Boolean,
    require: true,
  },
  transaction_id: {
    type: String,
    require: true,
    index: true,
    unique: true,
  },
});

const InvalidTransactionModel = mongoose.model(
  "invalidTransactions",
  InvalidTransactionSchema
);

export default InvalidTransactionModel;
