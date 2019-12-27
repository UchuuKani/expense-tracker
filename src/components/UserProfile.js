import React, {useState, useEffect} from "react";
import axios from "axios";
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from "./User";
import TransactionList from "./TransactionList";

const UserProfile = ({userId}) => {
  const [user, setUser] = useState({user: {}});

  useEffect(() => {
    const fetchUser = async (id) => {
      const {data} = await axios.get(`/api/users/${userId}`);

      setUser(data);
    }

    fetchUser()
  }, [userId]);

  return (
    <div>
      {
        user.id &&
        <div>
          <User user={user} />
          <h2>Transactions</h2>
          {
            user.user_transactions ? <TransactionList userTransactions={user.user_transactions} /> : <h1>No posted transactions</h1>
          }

        </div>
      }
    </div>
    )
}

export default UserProfile;
