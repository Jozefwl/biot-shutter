import React from "react"
import Name from "../components/Name"
import Control from "../components/Control"
import Settings from "../components/Settings"
import { useDataContext } from '../DataContext';
import {Spinner, Card }from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

function Home() {

    const { data, fetchData } = useDataContext()
  
    return (
      <div className="App">
        <h1 className="Header">Blinds control</h1>
        <div className="Card">
        <Card>
         {data ? (
          <>
            <Card.Header>
              <Name name={data.blindStatus.name} id={data.blindStatus._id} fetchData={fetchData}/>
            </Card.Header>
            <Card.Body>
            <Control id={data.blindStatus._id} pos={data.blindStatus.motorPosition} fetchData={fetchData}/>
            <Settings 
              id={data.blindStatus._id} 
              useDaylight={data.blindStatus.daylightSensor}
              fetchData={fetchData}
            />
            </Card.Body>
          </>
         ):(
          <Spinner animation="border" />
         )}
         </Card>
         </div>
        <Toaster />
      </div>
    );
  }

export default Home