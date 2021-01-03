import React, { useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import axios from "axios";

import styles from "./SigninForm.module.scss";
import { UserContext, LOGIN_EVENT } from "../UserContext/UserContext";

const SigninForm: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useContext(UserContext);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    // todo: probably need to encrypt password, but also need to post to backend route
    console.log("signup email", email);
    console.log("signup password", password);
    try {
      const userData = await axios.post("/auth/login", {
        email,
        password,
      });

      user.send({ type: LOGIN_EVENT, payload: { ...userData.data } });
      history.push("/transactions");
    } catch (err) {
      console.log("what is userData when incorrect password or email?", err);
      console.error(err);
    }
  };

  const checkLoggedIn = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/auth/me");
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("user objjjjjj", user);
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

export default withRouter(SigninForm);
