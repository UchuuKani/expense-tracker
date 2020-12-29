import React, { useContext, useState } from "react";
import axios from "axios";
import { RouteComponentProps, withRouter } from "react-router";

import styles from "./SignupForm.module.scss";
import { UserContext, SIGNUP_EVENT } from "../UserContext/UserContext";

const SignupForm: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useContext(UserContext);

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
      user.send({ type: SIGNUP_EVENT, payload: { ...data } });
      history.push("/");
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

export default withRouter(SignupForm);
