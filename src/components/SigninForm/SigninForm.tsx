import React, { useState } from "react";

import styles from "./SigninForm.module.scss";

const SigninForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    // todo: probably need to encrypt password, but also need to post to backend route
    console.log("signup username", username);
    console.log("signup password", password);
  };

  return (
    <div className={styles["signin-container"]}>
      <h2>Sign In</h2>
      <form className={styles["signin-form"]} onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            className={styles["user-input"]}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            className={styles["user-input"]}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SigninForm;
