import './App.css';
import React from 'react';
import Register from './components/Register'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./routes/Home"

function App() {

  return (
    <div className="App">
      <Router>
        <Routes> 
          <Route path="/" element={<Register/>}/>
          <Route path="/home" Component={Home}/>
        </Routes> 
      </Router>
    </div>
  );
}

export default App;
