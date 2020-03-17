import React from 'react';

const Transaction = ({ transaction }) => {
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
