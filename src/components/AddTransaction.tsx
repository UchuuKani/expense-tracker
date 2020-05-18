import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

import { ITransaction } from "./Transaction";

// use FormEvent to type the submit event in the form
// use ChangeEvent to type the onChange events

interface Props {
  userId: string;
  addNewTransaction: (actionFn: any, transaction: ITransaction) => void;
}

interface ServerResponse {
  data: ITransaction;
}

function addTransactionCreator(
  transaction: ITransaction
): { type: string; payload: ITransaction } {
  return { type: "ADD_TRANSACTION", payload: transaction };
}

const AddTransaction: React.FunctionComponent<Props> = ({
  userId,
  addNewTransaction,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [tags, setTags] = useState("");

  // type the event, probably also want to render something if there is an error - not sure how to use useAxios here though
  // as hooks need to be called in the top level scope of a functional component but I want to only useAxios on submit - would
  // be violating no conditional hooks?
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const { data } = await axios.post<ITransaction>(`/api/users/${userId}`, {
        description,
        amount,
        tags,
      });
      console.log("the transaction", data);
      setDescription("");
      setAmount("");
      setTags("");
      addNewTransaction(addTransactionCreator, data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction">
      <ul className="flex-outer">
        <li>
          <label id="description-label" htmlFor="transactionDescription">
            Description
          </label>
          <input
            id="transaction-description"
            type="text"
            name="transactionDescription"
            value={description}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setDescription(event.target.value)
            }
            placeholder="Enter description"
          ></input>
        </li>
        <li>
          <label id="transaction-amount" htmlFor="transactionAmount">
            Amount
          </label>
          <input
            type="text"
            name="transactionAmount"
            value={amount}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setAmount(event.target.value)
            }
            placeholder="Enter amount"
          ></input>
        </li>
        <li>
          <label id="add-tags-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags-input"
            type="text"
            name="tags"
            value={tags}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setTags(event.target.value)
            }
            placeholder="Enter tags as a comma separated list"
          ></input>
        </li>
        <li>
          <button id="add-transaction-btn" type="submit">
            Submit
          </button>
        </li>
      </ul>
    </form>
  );
};

export default AddTransaction;
