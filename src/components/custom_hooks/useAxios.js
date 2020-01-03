import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default (url, config) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(null);

  async function axiosCall() {
    try {
      const { data } = await axios.request({
        ...config,
        url,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    axiosCall();
  }, []);

  return { response, loading };
};
