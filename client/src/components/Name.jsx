import React, {useState} from "react";
import {Button, Modal, Form, FloatingLabel} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiRename } from '@mdi/js';

function Name(props) {

    const [newName, setNewName] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setNewName("")
    }

    const handleShow = () => setShow(true);

    const handleRename = () => {
        setNewName("")
        handleClose();   
    }

    return(
        <div className="Name">
            <p>{props.name} <Button variant="outline-secondary" onClick={handleShow}><Icon path={mdiRename} size={1.7} /></Button></p>

            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Přejmenovat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <FloatingLabel controlId="floatingInput" label="Nový název" className="mb-3">
                        <Form.Control type="text" placeholder="např. Ložnice" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zrušit
                    </Button>
                    <Button variant="primary" onClick={handleRename} disabled={!newName.trim()}>
                        Uložit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Name