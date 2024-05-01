import React, {useState} from "react";
import {Button, Modal, Form} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiClockEditOutline } from '@mdi/js';
import config from '../config'
import toast from 'react-hot-toast';

function TimeSettings(props) {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setSelectedTime("")
        setAction("")
        setId("")
        setShow(false)
    }

    const downEvent = props.TimeSettings.find(event => event.action === "down")
    const upEvent = props.TimeSettings.find(event => event.action === "up")

    const [selectedTime, setSelectedTime] = useState("")
    const [action, setAction] = useState("")
    const [id, setId] = useState("")

    const handleTimeInput = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleTimeEdit = async (time, action) => {

        try {
            const dToIn = {
                id: id,
                newTime: time,
                action: action
            };
  
            const response = await fetch(`${config.URI}/schedule/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dToIn),
            });
  
            if (response.ok) {
                props.fetchData();
                toast.success("Úspěšně změněno");
                handleClose();
            } else {
                handleClose()
                throw new Error('Chyba při nastavování času');
                
            }
        } catch (error) {
            toast.error("Chyba při nastavování času");
            handleClose()
            console.error('Chyba při nastavování času', error);
        }
    }; 

    return(
        <div>
            {!props.show ? (null) : (
                <>
                <h4>Časy</h4>
                Otevření: <code>{upEvent.time}</code>  <Button variant="outline-secondary" onClick={() => {handleShow(); setAction("up"); setId(upEvent._id)}}><Icon path={mdiClockEditOutline} size={1} /></Button><br/>
                Zavření: <code>{downEvent.time}</code>  <Button variant="outline-secondary" onClick={() => {handleShow(); setAction("down"); setId(downEvent._id)}}><Icon path={mdiClockEditOutline} size={1} /></Button>
                </>
                )
            }

            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Změna času</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <Form>
                     <input type="time" className="form-control" value={selectedTime} onChange={handleTimeInput}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Zrušit</Button>
                    <Button variant="primary" onClick={() =>  handleTimeEdit(selectedTime, action)}>Uložit a provést</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TimeSettings