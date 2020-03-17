import React from 'react';

import Transaction from './Transaction';

const TransactionList = ({ userTransactions }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
        {userTransactions.map(transaction => {
          return <Transaction key={transaction.id} transaction={transaction} />;
        })}
      </tbody>
    </table>
  );
};

export default TransactionList;
