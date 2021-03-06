import React from "react";

import styles from "./User.module.scss";

// instead of defining a User interface with optional keys for all the fieds a User coming back from the backend might have, just
// explicitly defining the user fields I expect to receive as props to render this component
// e.g. I am expecting to receive a prop called `user` and a user can have more than email and name fields, but I am only
// using those fields to render the User component
interface Props {
  name: string;
  email: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
}

const User: React.FunctionComponent<Props> = ({ name, email }) => {
  return (
    <div className={styles["user-heading"]}>
      <h2>User Info</h2>
      <h3>Username: {name}</h3>
      <h3>Email: {email}</h3>
    </div>
  );
};

export default User;
