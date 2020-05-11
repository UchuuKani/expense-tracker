import React from "react";
import { ITag } from "./Tag";

interface Props {
  transaction: ITransaction;
}

export interface ITransaction {
  description: string;
  amount: number;
  transaction_date: string;
  id: number;
  user_id: number;
  tags: Array<ITag>;
}

const Transaction = ({ transaction }: Props) => {
  const { description, amount, transaction_date } = transaction;

  return (
    <tr>
      <td>{description}</td>
      <td>${(amount / 100).toFixed(2)}</td>
      <td>{transaction_date}</td>
    </tr>
  );
};

export default Transaction;
