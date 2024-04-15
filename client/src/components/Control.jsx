import React, {useState} from "react";
import {Button, Modal, Form} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiArrowDownThick, mdiArrowUpThick, mdiArrowUpDownBold, mdiWindowShutterOpen, mdiWindowShutter } from '@mdi/js';

function Control(props) {

    const [opened, setOpened] = useState(true)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className="Control">
            {opened ? (
                <div>
                    <Icon path={mdiWindowShutterOpen} size={6} color="gray"/> <h5>Vytáhnuté</h5>
                </div>
                ):(
                <div>
                    <Icon path={mdiWindowShutter} size={6} color="gray" /> <h5>Zatáhnuté</h5>
                </div>
            )}
            <Button className="ControlButtons" variant="outline-success" disabled={opened}><Icon path={mdiArrowUpThick} size={3} /></Button>
            <Button className="ControlButtons" variant="outline-secondary" onClick={handleShow}><Icon path={mdiArrowUpDownBold} size={3} /></Button>
            <Button className="ControlButtons" variant="outline-danger" disabled={!opened}><Icon path={mdiArrowDownThick} size={3} /></Button>

            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Nastavení polohy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <Form.Label>Poloha vytáhnutí</Form.Label><br/>
                    <Button variant="outline-primary" className="ModalButtons">0 %</Button>
                    <Button variant="outline-primary" className="ModalButtons">25 %</Button>
                    <Button variant="outline-primary" className="ModalButtons">50 %</Button>
                    <Button variant="outline-primary" className="ModalButtons">75 %</Button>
                    <Button variant="outline-primary" className="ModalButtons">100 %</Button>
                </Modal.Body>
                <Modal.Body>
                    <Form.Label>Ruční nastavení</Form.Label>
                    <Form.Range />
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

export default Control