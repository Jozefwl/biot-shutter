import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/blinds/status?id=662cd4ebe7ca5f43b4e6e82a');
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

  /* // Zpoždění funkce fetchData
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