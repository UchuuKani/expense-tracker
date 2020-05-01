import React, { useState } from "react";

const AddTransaction = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    console.log(description, amount);
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction">
      <label htmlFor="transactionDescription">Description</label>
      <input
        type="text"
        name="transactionDescription"
        value={description}
        onChange={(e: any): void => setDescription(e.target.value)}
      ></input>
      <label htmlFor="transactionAmount">Amount</label>
      <input
        type="text"
        name="transactionAmount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      ></input>
      <div>
        <label htmlFor="tags">
          Please enter tags as a comma separated list
        </label>
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        ></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddTransaction;
