import React, { useState } from "react";
import axios from "axios";

import styles from "./SignupForm.module.scss";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    // todo: probably need to encrypt password, but also need to post to backend route
    console.log("signup email", email);
    console.log("signup password", password);
    try {
      const { data } = await axios.post("/auth/signup", {
        email,
        password,
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles["signup-container"]}>
      <h2>Sign Up</h2>
      <form className={styles["signup-form"]} onSubmit={handleSubmit}>
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
    </div>
  );
};

export default SignupForm;
