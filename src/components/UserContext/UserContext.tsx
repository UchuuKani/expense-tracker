import React, { useReducer, useEffect } from "react";
import axios from "axios";

// reducer event types
export const LOGIN_EVENT = "LOGIN_EVENT";
export const SIGNUP_EVENT = "SIGNUP_EVENT";
export const LOGOUT_EVENT = "LOGOUT_EVENT";

// interface for defining user state
export interface IUserContext {
  name: string;
  email: string;
  id: number;
  status: string;
}

// interfaces for payloads start
// interface for payload for LOGIN_EVENT and SIGNUP_EVENT
interface IAuthEvent {
  name: string;
  email: string;
  id: number;
}
// interfaces for payloads end

// interfaces for events start
// interface for type of event that reducer receives when user logs in
interface LoginEvent {
  type: string;
  payload: IAuthEvent;
}

interface SignupEvent {
  type: string;
  payload: IAuthEvent;
}

// interface for type of event that reducer receives when user logs out
interface LogoutEvent {
  type: string;
}
// interfaces for events end

// the reducer can receive two types of actions: one for user being logged in and one for user being logged out
export type UserAuthEvent = LoginEvent | LogoutEvent | SignupEvent;

// initial user state
const initUser = {
  name: "",
  email: "",
  id: -1,
  status: "SIGNED_OUT",
};

interface UserContextType {
  state: typeof initUser;
  send: (event: UserAuthEvent) => void;
}

function reducer(state: IUserContext, event: UserAuthEvent): IUserContext {
  switch (event.type) {
    case LOGIN_EVENT: {
      if ("payload" in event) {
        // figure out if the "else return state" is a robust way to handle if an event of type LOGIN_EVENT - gut feeling is no
        return { ...state, ...event.payload, status: "SIGNED_IN" };
      } else return state;
    }
    case SIGNUP_EVENT: {
      if ("payload" in event) {
        return { ...state, ...event.payload, status: "SIGNED_IN" };
      } else return state;
    }
    case LOGOUT_EVENT: {
      return { ...initUser, status: "SIGNED_OUT" };
    }
    default:
      return state;
  }
}

export const UserContext = React.createContext<UserContextType>({
  state: initUser,
  send: () => {},
});

export const UserContextProvider: React.FC = ({ children }) => {
  const [state, send] = useReducer(reducer, initUser);

  useEffect(() => {
    async function checkAuth(): Promise<void> {
      try {
        const authUser = await axios.get("/auth/me");
        const { data } = authUser;
        send({ type: LOGIN_EVENT, payload: data });
      } catch (authErr) {
        console.error(authErr);
      }
    }

    checkAuth();
  }, []);
  const value = { state, send };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
