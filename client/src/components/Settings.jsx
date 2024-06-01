import React from "react"
import Switch from "react-switch"
import config from '../config'
import toast from 'react-hot-toast';
import {Stack} from 'react-bootstrap'

function Settings(props) {

    const useDaylight = props.useDaylight
  
    const handleChange = async (action) => {

      try {
          let dToIn = {
            id: props.id,
            daylightSensor: !useDaylight,
          }

          const response = await fetch(`${config.URI}/blinds/update`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(dToIn),
          });

          if (response.ok) {
              props.fetchData();
              toast.success("Úspěšně změněno");
          } else {
              const responseJson = await response.json();
              const errorMessage = responseJson.dToOut.msg;
              toast.error(errorMessage);
              throw new Error('Chyba při nastavování žaluzií');
              
          }
      } catch (error) {
          console.error('Chyba při nastavování žaluzií', error);
      }
  }; 
  

    return(
        <div className="Settings">
            <h3>Nastavení</h3>
            <Stack direction="horizontal" >
                <p>Senzor denního světla </p>
                <Switch onChange={() => handleChange("daylightSensor")} checked={useDaylight}  className=" ms-auto"/>
                <br/>
            </Stack>
        </div>
    )
}

export default Settings