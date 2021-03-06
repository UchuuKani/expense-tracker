import React from "react";

import Transaction, { ITransaction } from "../Transaction/Transaction";
import styles from "./TransactionList.module.scss";

interface Props {
  userTransactions: ITransaction[];
  removeTransaction: (transactionId: number) => void;
}

const TransactionList: React.FunctionComponent<Props> = ({
  userTransactions,
  removeTransaction,
}) => {
  // console.log("number of all transactions for a user", userTransactions.length);
  console.log("transaction date formatted?", userTransactions);
  return (
    <table className={styles["transaction-list"]}>
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
