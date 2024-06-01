import React, {useState} from "react";
import {Button, Modal, Form, FloatingLabel, Stack} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiRename } from '@mdi/js';
import toast from 'react-hot-toast';
import config from '../config'

function Name(props) {

    const [newName, setNewName] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setNewName("");
    }

    const handleShow = () => setShow(true);

    const handleRename = async () => {

        try {
            const dToIn = {
                id: props.id,
                newName: newName,
            };
  
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
                handleClose();
            } else {
                handleClose()
                throw new Error('Chyba při editaci jména');
                
            }
        } catch (error) {
            toast.error("Chyba při editaci jména");
            handleClose()
            console.error('Chyba při editaci jména', error);
        }
    };


    return(
        <div className="Name">
            <h3 className="header-title" onClick={handleShow} >{props.name}</h3>
            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Přejmenovat: {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <FloatingLabel controlId="floatingInput" label="Nový název" className="mb-3">
                        <Form.Control type="text" placeholder="např. Ložnice" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Zrušit</Button>
                    <Button variant="primary" onClick={handleRename} disabled={!newName.trim()}>Uložit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Name