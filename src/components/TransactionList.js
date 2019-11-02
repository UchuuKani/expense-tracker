import React from "react";

import Transaction from "./Transaction";

const TransactionList = (props) => {
  const {userTransactions} = props;

  return (
    <div>
      <p>Transactions</p>
      {
        userTransactions.map(transaction => {
          return <Transaction key={transaction.transactionid}
          transaction={transaction} />
        })
      }
    </div>
  )
}

export default TransactionList;
