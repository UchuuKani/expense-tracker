import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";

// Axios has typings directly from its repo - AxiosRequestConfig interface has all potential config options on it as optional fields
export default (url: string, config?: AxiosRequestConfig) => {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  async function axiosCall() {
    try {
      setLoading(true);
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

      setResponse(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    axiosCall();
  }, []);

  return [response, loading];
};
