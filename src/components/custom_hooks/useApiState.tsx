import { useReducer } from "react";

type Action<T> =
  | { type: "PENDING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "FAIL" };

interface State<T> {
  initial: string;
  pending: string;
  success: string;
  error: string;
}

const initialState: { current: string } = { current: "idle" };

const dataFetchReducer = (
  state: { current: string },
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "IDLE":
      return { ...state, current: "idle" };
    case "PENDING":
      return { ...state, current: "pending" };
    case "SUCCESS":
      return { ...state, current: "success" };
    case "ERROR":
      return { ...state, current: "error" };
    default:
      return state;
  }
};

export const useApiState = () => {
  const [status, dispatch] = useReducer(dataFetchReducer, initialState);
  return {
    status,
    dispatch,
  };
};
