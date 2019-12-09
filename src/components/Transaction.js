import React from "react";

const Transaction = (props) => {
  const {description, amount} = props.transaction;

  return (
    <tr>
      <td>{description}</td>
      <td>${(amount / 100).toFixed(2)}</td>
      <td>12/05/2019</td>
    </tr>
  )
}

export default Transaction;
