import React, { useState, useEffect } from 'react';
import useAxios from './custom_hooks/useAxios';
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User, { IUser } from './User';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';

const UserProfile = ({ userId }: IUser) => {
  // // want to use a useReducer call for user transactions

  const [user]: any = useAxios(`/api/users/${userId}`);

  return (
    <div>
      {user.id && (
        <div>
          <User user={user} />
          <h2>Transactions</h2>
          <div className="transaction-list">
            {user.transactions ? (
              <TransactionList userTransactions={user.transactions} />
            ) : (
              <h1>No posted transactions</h1>
            )}
          </div>
        </div>
      )}
      <AddTransaction />
    </div>
  );
};

export default UserProfile;
