import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react"
import Name from "./components/Name"
import Control from "./components/Control"
import Settings from "./components/Settings"

function App() {


  return (
    <div className="App">
      <h1 className="Header">Blinds control</h1>
      <Name />
      <Control />
      <Settings />
    </div>
  );
}

export default App;
