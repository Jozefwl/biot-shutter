import React, {useState} from "react"
import Switch from "react-switch"
import TimeSettings from "./TimeSettings"

function Settings(props) {

    const [checked, setChecked] = useState(false)
    const [checked2, setChecked2] = useState(true)
  
    const handleChange = (checked) => {
      if (checked === true) {setChecked(true)
      } else {setChecked(false)}
    }
  
    const handleChange2 = (checked) => {
      if (checked === true) {setChecked2(true)
      } else {setChecked2(false)}
      console.log(checked2)
    }

    return(
        <div>
            <h3>Nastavení</h3>
            Senzor denního světla   <Switch onChange={handleChange} checked={checked} /><br/>
            Automatický časovač   <Switch onChange={handleChange2} checked={checked2} /><br/>
            <br />
            <TimeSettings />
        </div>
    )
}

export default Settings