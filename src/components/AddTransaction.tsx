import React, { useState, FormEvent, ChangeEvent } from "react";
import axios, { AxiosRequestConfig } from "axios";

// use FormEvent to type the submit event in the form
// use ChangeEvent to type the onChange events

interface Props {
  userId: number;
}

const AddTransaction = ({ userId }: Props) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [tags, setTags] = useState("");

  // type the event, probably also want to render something if there is an error - not sure how to use useAxios here though
  // as hooks need to be called in the top level scope of a functional component but I want to only useAxios on submit - would
  // be violating no conditional hooks?
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const transactionData = await axios.post(`/api/users/${userId}`, {
        description,
        amount,
        tags,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction">
      <label htmlFor="transactionDescription">Description</label>
      <input
        type="text"
        name="transactionDescription"
        value={description}
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          setDescription(event.target.value)
        }
      ></input>
      <label htmlFor="transactionAmount">Amount</label>
      <input
        type="text"
        name="transactionAmount"
        value={amount}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAmount(event.target.value)
        }
      ></input>
      <div>
        <label htmlFor="tags">
          Please enter tags as a comma separated list
        </label>
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setTags(event.target.value)
          }
        ></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddTransaction;
