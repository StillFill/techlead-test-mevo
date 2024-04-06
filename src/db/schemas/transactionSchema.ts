import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
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

const TransactionModel = mongoose.model("transactions", TransactionSchema);

export default TransactionModel;
