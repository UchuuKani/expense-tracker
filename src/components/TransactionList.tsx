import React from "react";

import Transaction, { ITransaction } from "./Transaction";

interface Props {
  userTransactions: ITransaction[];
}

const TransactionList: React.FunctionComponent<Props> = ({
  userTransactions,
}) => {
  return (
    <table className="transaction-list">
      <tbody>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
        {userTransactions.length &&
          userTransactions.map((transaction) => {
            return (
              <Transaction key={transaction.id} transaction={transaction} />
            );
          })}
      </tbody>
    </table>
  );
};

export default TransactionList;
