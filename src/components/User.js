import React from "react";

const User = (props) => {
  const {name, email} = props.user;
  return (
    <div className="user">
      <h1>User Info</h1>
      <h2>Username: {name}</h2>
      <h2>Email: {email}</h2>
    </div>
  )
}

export default User;
