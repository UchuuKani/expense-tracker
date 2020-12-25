import React, { useState } from "react";
import axios from "axios";

import styles from "./SigninForm.module.scss";

const SigninForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    // todo: probably need to encrypt password, but also need to post to backend route
    console.log("signup email", email);
    console.log("signup password", password);
    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkLoggedIn = async (): Promise<void> => {
    try {
      const message = await axios.post("/auth/logout");
      console.log(message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles["signin-container"]}>
      <h2>Sign In</h2>
      <form className={styles["signin-form"]} onSubmit={handleSubmit}>
        <label htmlFor="email">
          email:
          <input
            type="text"
            name="email"
            className={styles["user-input"]}
            onChange={(event) => setEmail(event.target.value)}
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
      <button type="button" onClick={checkLoggedIn}>
        Test to see if session works
      </button>
    </div>
  );
};

export default SigninForm;
