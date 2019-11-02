import React from "react";

const Transaction = (props) => {
  const {description, amount} = props.transaction;

  return (
    <div>
      <h2>Description</h2>
      <h3>{description}</h3>
      <h2>Amount</h2>
      <h3>${(amount / 100).toFixed(2)}</h3>
    </div>
  )
}

export default Transaction;
