import React, {useState} from "react"
import Switch from "react-switch"
import TimeSettings from "./TimeSettings"
import config from '../config'
import toast from 'react-hot-toast';

function Settings(props) {

    const useDaylight = props.useDaylight
    const useTimeSettings = props.useTimeSettings
  
    const handleChange = async (action) => {

      try {
          let dToIn = {
            id: props.id
          };

          if (action === "daylightSensor") {
            dToIn = {
              ...dToIn,
              daylightSensor: !useDaylight,
              manualTimeSettings: useTimeSettings
            }
          }

          if (action === "manualTimeSettings") {
            dToIn = {
              ...dToIn,
              daylightSensor: useDaylight,
              manualTimeSettings: !useTimeSettings
            }
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
        <div>
            <h3>Nastavení</h3>
            Senzor denního světla <Switch onChange={() => handleChange("daylightSensor")} checked={useDaylight} /><br/>
            Automatický časovač <Switch onChange={() => handleChange("manualTimeSettings")} checked={useTimeSettings} /><br/>
            <br />
            <TimeSettings />
        </div>
    )
}

export default Settings