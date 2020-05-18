import React from "react";
import { ITag } from "./Tag";

interface Props {
  transaction: ITransaction;
  removeTransaction: (transactionId: number) => void;
}

export interface ITransaction {
  description: string;
  amount: number;
  transaction_date: string;
  id: number;
  user_id: number;
  tags?: ITag[];
}

const Transaction = ({ transaction, removeTransaction }: Props) => {
  const { description, amount, transaction_date } = transaction;

  return (
    <tr>
      <td onClick={() => removeTransaction(transaction.id)}>X</td>
      <td>{description}</td>
      <td>${(amount / 100).toFixed(2)}</td>
      <td>{transaction_date}</td>
    </tr>
  );
};

export default Transaction;
