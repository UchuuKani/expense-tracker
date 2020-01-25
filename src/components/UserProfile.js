import React, { useState, useEffect } from 'react';
import useAxios from './custom_hooks/useAxios';
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from './User';
import TransactionList from './TransactionList';

const UserProfile = ({ userId }) => {
  // // want to use a useReducer call for user transactions

  const [user] = useAxios(`/api/users/${userId}`);

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

  const handleSubmit = e => {
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
        onChange={e => setDescription(e.target.value)}
      ></input>
      <label htmlFor="transactionAmount">Amount</label>
      <input
        type="text"
        name="transactionAmount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      ></input>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserProfile;
