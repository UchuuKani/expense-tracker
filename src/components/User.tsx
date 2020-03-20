import React from 'react';

export interface IUser {
  name: string;
  email: string;
  userId: number;
}

interface Props {
  user: IUser;
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
