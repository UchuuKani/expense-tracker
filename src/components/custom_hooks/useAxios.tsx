import { useState, useEffect } from 'react';
import axios from 'axios';

export default (url, config) => {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  async function axiosCall() {
    try {
      setLoading(true);
      const { data } = await axios.request({
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
