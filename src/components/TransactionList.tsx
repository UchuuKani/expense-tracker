import React from "react";

import Transaction, { ITransaction } from "./Transaction";

interface Props {
  userTransactions: Array<ITransaction>;
}

const TransactionList = ({ userTransactions }: Props) => {
  return (
    <table className="transaction-list">
      <tbody>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
        {userTransactions.map((transaction) => {
          return <Transaction key={transaction.id} transaction={transaction} />;
        })}
      </tbody>
    </table>
  );
};

export default TransactionList;
