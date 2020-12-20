import * as React from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { ITransaction } from "./Transaction";

interface MatchParams {
  userId: string;
  transactionId: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const SingleTransaction: React.FunctionComponent<Props> = (props) => {
  const { userId, transactionId } = props.match.params;
  const [transaction, setTransaction] = React.useState<ITransaction | null>(
    null
  );

  React.useEffect(() => {
    axios
      .get(`/api/users/${userId}/transactions/${transactionId}`)
      .then((res) => setTransaction(res.data))
      .catch((err) => console.error(err));
  }, [transactionId, userId]);

  return (
    <>
      <table className="transaction-list">
        <tbody>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
          {transaction && (
            <tr>
              <td>{transaction.description}</td>
              <td>${transaction.amount}</td>
              <td>{transaction.transaction_date}</td>
            </tr>
          )}
        </tbody>
      </table>
      <ul>
        <h3>Tags</h3>
        {transaction &&
          transaction.tags &&
          transaction.tags.map((tag) => {
            return <li key={tag.id}>{tag.tag_name}</li>;
          })}
      </ul>
    </>
  );
};

export default SingleTransaction;
