import { Transaction } from "../models/Transaction";
import { TransactionRequest } from "../models/requests/TransactionRequest";
import {
  convertTransactions,
  detectSuspiciousTransactions,
  generateTransactionId,
  separateNegativeTransactions,
} from "./transactions.service";

describe("Transactions Service", () => {
  it("separate negative transactions", async () => {
    const mockTransactions: TransactionRequest[] = [
      {
        amount: 100,
        from: "123",
        to: "456",
      },
      {
        amount: -100,
        from: "123",
        to: "456",
      },
    ];

    const result = separateNegativeTransactions(mockTransactions);

    expect(result.validTransactions).toEqual([mockTransactions[0]]);
    expect(result.invalidTransactions.length).toBe(1);
  });

  it("convert transactions", async () => {
    const mockTransactions: TransactionRequest[] = [
      {
        amount: 100,
        from: "123",
        to: "456",
      },
      {
        amount: -100,
        from: "123",
        to: "456",
      },
    ];

    const mockResult: Transaction[] = [mockTransactions[0]].map((a) => ({
      ...a,
      suspicious: false,
    }));

    const result = convertTransactions(mockTransactions);

    expect(result.validTransactions).toEqual(mockResult);
    expect(result.invalidTransactions.length).toBe(1);
  });

  it("separate suspicious transactions", async () => {
    const mockTransactions: TransactionRequest[] = [
      {
        amount: 100,
        from: "123",
        to: "456",
      },
      {
        amount: 5000001,
        from: "123",
        to: "456",
      },
    ];

    const mockResult: Transaction[] = [
      {
        amount: 100,
        from: "123",
        to: "456",
        suspicious: false,
      },
      {
        amount: 5000001,
        from: "123",
        to: "456",
        suspicious: true,
        reason: "suspicious",
      },
    ];

    const result = detectSuspiciousTransactions(mockTransactions);

    expect(result).toEqual(mockResult);
  });

  it("generate transaction_id", async () => {
    const result = generateTransactionId({ to: "A", from: "B", amount: 10 });

    expect(result).toBe("A-B-10");
  });
});
