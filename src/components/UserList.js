import React, {useState, useEffect} from "react";
import axios from "axios";

import User from "./User"

const UserList = (props) => {
  const [users, setUsers] = useState({users: []});

  useEffect(() => {
    const fetchUsers = async () => {
        const {data} = await axios.get("/api/users");
        setUsers(data);
    }

    fetchUsers()
  }, []);

  return (
    <div>
      <h1>This is a list of all registered users</h1>
      <div className="user-list">
        {
          users.length && users.map((user, idx) => {
            return <User key={idx} user={user} />
          })
        }
      </div>
    </div>
  )
}

export default UserList;
