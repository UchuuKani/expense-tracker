import React, { useState, useEffect } from 'react';
import useAxios from './custom_hooks/useAxios';
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User, { IUser } from './User';
import TransactionList from './TransactionList';

const UserProfile = ({ userId }: IUser) => {
  // // want to use a useReducer call for user transactions

  const [user]: any = useAxios(`/api/users/${userId}`);

  return (
    <div>
      {user.id && (
        <div>
          <User user={user} />
          <h2>Transactions</h2>
          <div className="transactionList">
            {user.transactions ? (
              <TransactionList userTransactions={user.transactions} />
            ) : (
              <h1>No posted transactions</h1>
            )}
          </div>
        </div>
      )}
      <AddForm />
    </div>
  );
};

const AddForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    console.log(description, amount);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        onChange={e => setAmount(e.target.value)}
      ></input>
      <div>
        <label for="tags">Please enter tags as a comma separated list</label>
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={e => setTags(e.target.value)}
        ></input>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserProfile;
