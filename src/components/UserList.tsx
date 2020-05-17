import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IUser } from "./User";

const UserList: React.FunctionComponent = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>This is a list of all registered users</h1>
      <div className="user-list">
        {users.length &&
          users.map((user: any) => {
            return (
              <Link key={user.id} to={`/users/${user.id}`}>
                <h3>{user.name}</h3>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default UserList;
