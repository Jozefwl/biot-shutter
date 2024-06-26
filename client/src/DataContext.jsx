import React, { createContext, useState, useContext, useEffect } from 'react';
import config from './config'

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.URI}/blinds/status?id=${config.blindsId}`);
      const responseData = await response.json();
      setData(responseData.dToOut);
      console.log(responseData.dToOut)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => { 
    
    fetchData();
  }, []);

  /* // Nasimulování opoždění
    useEffect(() => {
    const fetchDataWithDelay = async () => {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchData();
    };
    fetchDataWithDelay();
  }, []);
  */

  return (
    <DataContext.Provider value={{ data, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};