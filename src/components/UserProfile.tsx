import React, { useReducer, useEffect } from "react";
import axios from "axios";

//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from "./User";
import TransactionList from "./TransactionList";
import AddTransaction from "./AddTransaction";
import LoadingSpinner from "./common/Spinner";
import { ITransaction } from "./Transaction";

// for props, we are only bringing a prop called userId and using that in a custom hook to fetch data
interface Props {
  userId: number;
}

interface REvent {
  type: string;
  payload?: any;
}

interface UResponse {
  user: {
    id: number;
    name: string;
    email: string;
    transactions: Array<ITransaction>;
  };
}

const initialState = {
  status: "pending",
  user: {},
  error: null,
};

function profileReducer(
  state: { status: string; user: UResponse; error: any },
  event: REvent
) {
  switch (event.type) {
    case "PENDING":
      return { ...state, status: "pending" };
    case "SUCCESS":
      return { ...state, status: "success", user: event.payload };
    case "ERROR":
      return { ...state, status: "error", error: event.payload };
    default:
      return state;
  }
}

const UserProfile = ({ userId }: Props) => {
  // want to use a useReducer call for user transactions
  // also potentially want to use a state machine to handle the logic in the useAxios hook for handling loading, fetching, error,
  // and other potential states (does what I said even make sense?)
  // for now, will avoid typing [user] with an interface, e.g. IUser because syntax is confusing

  const [userState, dispatch] = useReducer(profileReducer, initialState);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);

      dispatch({ type: "SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "ERROR", payload: error });
    }
  }

  useEffect(() => {
    fetchUser();
    return () => {
      console.log("component unmounting");
    };
  }, []);
  console.log("the state should be set plz", userState);

  // TODO: figure out how I should manage the state here: want to be able to add, delete, and update the transaction list and
  // user data - as of now, TransactionList does not update because the userTransactions prop is only passed down once and
  // does not change as the current useEffect in useAxios only runs once on mount
  // more importantly, no way to delete a transaction currently because of above problem with how my state is set up

  return (
    <div>
      {userState.status === "success" && (
        <div id="test">
          {/* I was previously passing user={user.id} into the User component so the `Name` and `Email` fields were not being 
          rendered. No error from TS though...why is that? */}
          <User user={userState.user} />
          <div>
            <h2>Transactions</h2>
            {Array.isArray(userState.user.transactions) &&
            userState.user.transactions.length > 0 ? (
              <TransactionList userTransactions={userState.user.transactions} />
            ) : (
              <h3>No posted transactions</h3>
            )}
          </div>
        </div>
      )}
      {userState.status === "pending" && <LoadingSpinner />}
      {userState.status === "error" && <div>{userState.error.message}</div>}
      <AddTransaction userId={userId} />
    </div>
  );
};

export default UserProfile;
