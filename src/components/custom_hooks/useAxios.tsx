import { useState, useEffect } from "react";
import axios from "axios";

// for now, using `any` type to annotate config and destructured { data } variable returned from axios request as I don't know how
// to type them
export default (url: string, config?: any) => {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  async function axiosCall() {
    try {
      setLoading(true);
      const { data }: any = await axios.request({
        ...config,
        url,
      });

      setResponse(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    axiosCall();
  }, []);

  return [response, loading];
};
