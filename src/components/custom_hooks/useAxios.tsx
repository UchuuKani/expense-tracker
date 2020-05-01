import { useState, useEffect, useReducer } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export interface RState {
  current: string;
  response?: any;
  error?: any;
}

const initialState: RState = {
  current: "idle",
  response: undefined,
  error: undefined,
};

const dataFetchReducer = (
  state: RState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "IDLE":
      return { ...state, current: "idle" };
    case "PENDING":
      return { ...state, current: "pending" };
    case "SUCCESS":
      return { ...state, current: "success", response: action.payload };
    case "ERROR":
      return { ...state, current: "error", error: action.payload };
    default:
      return state;
  }
};

// Axios has typings directly from its repo - AxiosRequestConfig interface has all potential config options on it as optional fields
export default (url: string, config?: AxiosRequestConfig) => {
  // const [response, setResponse] = useState({});
  // const [loading, setLoading] = useState(false);
  const [status, dispatch]: [RState, any] = useReducer(
    dataFetchReducer,
    initialState
  );

  const stateActions: {
    initial: () => void;
    pending: () => void;
    success: (response: AxiosResponse) => void;
    error: (error: any) => void;
  } = {
    initial: () => {
      dispatch({ type: "INITIAL" });
    },
    pending: () => {
      dispatch({ type: "PENDING" });
    },
    success: (response) => {
      dispatch({ type: "SUCCESS", payload: response });
    },
    error: (error) => {
      dispatch({ type: "ERROR", payload: error });
    },
  };

  async function axiosCall() {
    try {
      stateActions.pending();
      // not positive how `const {data}` can be typed - Axios provides interfaces for its methods which take generics but this custom hook
      // is not specific to fetching Users or anything like that
      // https://github.com/axios/axios/blob/v0.19.0/index.d.ts#L136 - reference for Axios types
      // https://levelup.gitconnected.com/a-typescript-safe-api-82cc22c4f92d - reference for typing Axios calls
      // TS doesn't throw an error about the typing of `data` (the Axios response) - is it because the types of the response
      // bodies are typed with a generic, T, that defaults to type `any`? Hopefully so!
      const { data } = await axios.request({
        ...config,
        url,
      });

      stateActions.success(data);
    } catch (err) {
      console.error(err);
      stateActions.error(err);
    }
  }

  useEffect(() => {
    axiosCall();
  }, []);

  return [status];
};
