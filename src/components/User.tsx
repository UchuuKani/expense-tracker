import React from "react";

// instead of defining a User interface with optional keys for all the fieds a User coming back from the backend might have, just
// explicitly defining the user fields I expect to receive as props to render this component
// e.g. I am expecting to receive a prop called `user` and a user can have more than email and name fields, but I am only
// using those fields to render the User component
interface Props {
  user: {
    name: string;
    email: string;
  };
}

const User = ({ user }: Props) => {
  const { name, email } = user;
  return (
    <div className="user">
      <h1>User Info</h1>
      <h2>Username: {name}</h2>
      <h2>Email: {email}</h2>
    </div>
  );
};

export default User;
