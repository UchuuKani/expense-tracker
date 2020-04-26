import React, { useState, useEffect } from "react";
import useAxios from "./custom_hooks/useAxios";
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from "./User";
import TransactionList from "./TransactionList";
import AddTransaction from "./AddTransaction";

// for props, we are only bringing a prop called userId and using that in a custom hook to fetch data
interface Props {
  userId: number;
}

const UserProfile = ({ userId }: Props) => {
  // want to use a useReducer call for user transactions
  // also potentially want to use a state machine to handle the logic in the useAxios hook for handling loading, fetching, error,
  // and other potential states (does what I said even make sense?)
  // for now, will avoid typing [user] with an interface, e.g. IUser because syntax is confusing
  const [user]: any = useAxios(`/api/users/${userId}`);

  return (
    <div>
      {user.id && (
        <div>
          <User user={user.id} />
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
