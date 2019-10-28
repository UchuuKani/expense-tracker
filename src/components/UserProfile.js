import React from "react";
//this component represents the profile for a single user, and should render all
//of their transactions in <TranscationList /> => individual <Transcation />
import TranscationList from "./TranscationList";

const UserProfile = (props) => {
  const {name, email, userId} = props.user;

  return (
    <div>
      <p>Name: {name} Email: {email} UserId: {userId}</p>
      <TranscationList />
    </div>
  )
}

export default UserProfile;
