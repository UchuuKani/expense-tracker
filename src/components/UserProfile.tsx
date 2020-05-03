import React from "react";
import useAxios, { RState } from "./custom_hooks/useAxios";
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
  const [userStatus] = useAxios(`/api/users/${userId}`);

  // TODO: figure out how I should manage the state here: want to be able to add, delete, and update the transaction list and
  // user data - as of now, TransactionList does not update because the userTransactions prop is only passed down once and
  // does not change as the current useEffect in useAxios only runs once on mount

  return (
    <div>
      {userStatus.current === "success" && (
        <div id="test">
          {/* I was previously passing user={user.id} into the User component so the `Name` and `Email` fields were not being 
          rendered. No error from TS though...why is that? */}
          <User user={userStatus.response} />
          <div>
            <h2>Transactions</h2>
            {userStatus.response.transactions.length ? (
              <TransactionList
                userTransactions={userStatus.response.transactions}
              />
            ) : (
              <h1>No posted transactions</h1>
            )}
          </div>
        </div>
      )}
      {userStatus.current === "pending" && <div>Loading...</div>}
      {userStatus.current === "error" && <div>{userStatus.error.message}</div>}
      <AddTransaction userId={userId} />
    </div>
  );
};

export default UserProfile;
