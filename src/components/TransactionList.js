import React from "react";

import Transaction from "./Transaction";

const TransactionList = (props) => {
  const {transactions} = props;

  return (
    <div>
      <p>Transactions</p>
      {/*
        transactions.map(transaction => {
          return <Transaction key={transaction.transactionId}
          transaction={transaction} />
        })
      */}
    </div>
  )
}

export default TransactionList;
