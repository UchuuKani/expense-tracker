import React, { useReducer, useEffect } from "react";
import axios from "axios";

//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from "./User";
import TransactionList from "./TransactionList";
import AddTransaction from "./AddTransaction";
import LoadingSpinner from "./common/Spinner";
import { ITransaction } from "./Transaction";
import { RouteComponentProps } from "react-router-dom";

// not entirely sure what MatchParams and Props extends RouteComponentProps<MatchParams> does behind the scenes to make TS work
// but my understanding is RouteComponentProps brings in the implcitly passed props from using a component (UserProfile here) in
// a <Route />. Idea for doing this is seen in below SO link
// https://stackoverflow.com/questions/48138111/what-typescript-type-should-i-use-to-reference-the-match-object-in-my-props
interface MatchParams {
  userId: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

// don't understand above typing stuff going on

interface Response {
  id: number;
  name: string;
  email: string;
  transactions: ITransaction[];
}

interface State<T> {
  status: string;
  user: T | null;
  error: Error | null;
}

type Action<T> =
  | { type: "PENDING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: any }
  | { type: "ADD_TRANSACTION"; payload: ITransaction }
  | { type: "REMOVE_TRANSACTION"; payload: number };

const createProfileReducer = <T extends Response>() => (
  state: State<T>,
  action: Action<T>
) => {
  switch (action.type) {
    case "PENDING":
      return { ...state, status: "pending" };
    case "SUCCESS":
      return { ...state, status: "success", user: action.payload };
    case "ERROR":
      return { ...state, status: "error", error: action.payload };
    case "ADD_TRANSACTION":
      return state.user && state.user.transactions.length
        ? {
            ...state,
            user: {
              ...state.user,
              transactions: [action.payload, ...state.user.transactions],
            },
          }
        : { ...state };
    case "REMOVE_TRANSACTION":
      return state.user && state.user.transactions.length
        ? {
            ...state,
            user: {
              ...state.user,
              transactions: state.user.transactions.filter((transaction) => {
                return transaction.id !== action.payload;
              }),
            },
          }
        : { ...state };
    default:
      return state;
  }
};

const UserProfile: React.FunctionComponent<Props> = (props) => {
  // want to use a useReducer call for user transactions
  // also potentially want to use a state machine to handle the logic in the useAxios hook for handling loading, fetching, error,
  // and other potential states (does what I said even make sense?)
  // for now, will avoid typing [user] with an interface, e.g. IUser because syntax is confusing
  const profileReducer = createProfileReducer<Response>();
  const [userState, dispatch] = useReducer(profileReducer, {
    status: "pending",
    user: null,
    error: null,
  });

  useEffect(() => {
    axios
      .get(`/api/users/${props.match.params.userId}`)
      .then((res) => dispatch({ type: "SUCCESS", payload: res.data }))
      .catch((error) => dispatch({ type: "ERROR", payload: error }));
  }, []);
  console.log("the state should be set plz", userState);

  // TODO: figure out how I should manage the state here: want to be able to add, delete, and update the transaction list and
  // user data - as of now, TransactionList does not update because the userTransactions prop is only passed down once and
  // does not change as the current useEffect in useAxios only runs once on mount
  // more importantly, no way to delete a transaction currently because of above problem with how my state is set up

  const addNewTransaction = (
    actionFn: any,
    transaction: ITransaction
  ): void => {
    dispatch(actionFn(transaction));
  };

  const removeTransaction = (transactionId: number): void => {
    // so far not able to cause the DELETE request to error out on back end by passing an invalid transactionId (either one that
    // doesn't exist or empty request body) - should I check the query to see how to cause an error?
    axios
      .delete(`/api/users/${props.match.params.userId}`, {
        data: {
          transactionId,
        },
      })
      .then(() => {
        dispatch({ type: "REMOVE_TRANSACTION", payload: transactionId });
      })
      .catch((err) => dispatch({ type: "ERROR", payload: err }));
  };

  return (
    <div>
      {userState.status === "success" && (
        <div id="test">
          {/* I was previously passing user={user.id} into the User component so the `Name` and `Email` fields were not being 
          rendered. No error from TS though...why is that? */}
          {userState.user && (
            <User name={userState.user.name} email={userState.user.email} />
          )}
          <div>
            <h2>Transactions</h2>
            {userState.user && userState.user.transactions.length > 0 ? (
              <TransactionList
                userTransactions={userState.user.transactions}
                removeTransaction={removeTransaction}
              />
            ) : (
              <h3>No posted transactions</h3>
            )}
          </div>
        </div>
      )}
      {userState.status === "pending" && <LoadingSpinner />}
      {userState.status === "error" && <div>{userState.error.message}</div>}
      <AddTransaction
        userId={props.match.params.userId}
        addNewTransaction={addNewTransaction}
      />
    </div>
  );
};

export default UserProfile;
