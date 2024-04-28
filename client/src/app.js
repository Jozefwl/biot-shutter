import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import Name from "./components/Name"
import Control from "./components/Control"
import Settings from "./components/Settings"
import { useDataContext } from './DataContext';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const { data, fetchData } = useDataContext()

  return (
    <div className="App">
      <h1 className="Header">Blinds control</h1>
       {data ? (
        <>
          <Name name={data.name} id={data._id} fetchData={fetchData}/>
          <Control />
          <Settings />
        </>
       ):(
        <Spinner animation="border" />
       )}
      <Toaster />
    </div>
  );
}

export default App;
