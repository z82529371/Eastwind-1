import { useState, useEffect } from 'react';

function useFetchData(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!ignore) {
          setData(result);
        }
      } catch (e) {
        if (!ignore) {
          setError(e);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return data;
}

export default useFetchData;