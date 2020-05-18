import React from "react";

import Transaction, { ITransaction } from "./Transaction";

interface Props {
  userTransactions: ITransaction[];
  removeTransaction: (transactionId: number) => void;
}

const TransactionList: React.FunctionComponent<Props> = ({
  userTransactions,
  removeTransaction,
}) => {
  return (
    <table className="transaction-list">
      <tbody>
        <tr>
          <th></th>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
        {userTransactions.length &&
          userTransactions.map((transaction) => {
            return (
              <Transaction
                key={transaction.id}
                transaction={transaction}
                removeTransaction={removeTransaction}
              />
            );
          })}
      </tbody>
    </table>
  );
};

export default TransactionList;
