import React, {useState, useEffect} from "react";
import axios from "axios";
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import User from "./User";
import TransactionList from "./TransactionList";

const UserProfile = (props) => {
  const [user, setUser] = useState({user: {}});

  useEffect(() => {
    const fetchUser = async (id) => {
      const {data} = await axios.get(`/api/users/${props.match.params.userId}`);

      setUser(data);
    }

    fetchUser()
  }, []);

  console.log(user)

  return (
    <div>
      {
        user[0] && <User user={user[0]}/>
      }
    </div>
    )
}

export default UserProfile;
