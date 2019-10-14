import React from "react";

const UserProfile = (props) => {
  const {name, email} = props.user;

  return (
    <div>
      <p>Name: {name} Email: {email}</p>
    </div>
  )
}

export default UserProfile;
