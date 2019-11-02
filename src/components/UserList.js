import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


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
            return <Link key={user.userid} to={`/users/${user.userid}`}><h3>{user.name}</h3></Link>
          })
        }
      </div>
    </div>
  )
}

export default UserList;
