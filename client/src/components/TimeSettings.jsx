import React, {useState} from "react";
import {Button, Modal, Form} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiClockEditOutline } from '@mdi/js';


function TimeSettings(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return(
        <div>
            <h4>Časy</h4>
            Otevření: <code>07:00</code>  <Button variant="outline-secondary" onClick={handleShow}><Icon path={mdiClockEditOutline} size={1} /></Button><br/>
            Zavření: <code>19:00</code>  <Button variant="outline-secondary" onClick={handleShow}><Icon path={mdiClockEditOutline} size={1} /></Button>

            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Nastavení polohy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <Form>
                     <input type="time" class="form-control"/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zrušit
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Uložit a provést
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TimeSettings