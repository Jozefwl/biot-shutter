import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import Name from "./components/Name"
import Control from "./components/Control"
import Settings from "./components/Settings"
import { useDataContext } from './DataContext';
import Spinner from 'react-bootstrap/Spinner';

function App() {

  const { data, fetchData } = useDataContext()

  return (
    <div className="App">
      <h1 className="Header">Blinds control</h1>
       {data ? (
        <>
          <Name name={data.name}/>
          <Control />
          <Settings />
        </>
       ):(
        <Spinner animation="border" />
       )}
      
    </div>
  );
}

export default App;
