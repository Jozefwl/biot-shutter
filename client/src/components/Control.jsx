import React, {useState} from "react";
import {Button, Modal, Form, Stack, Spinner} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiArrowDownThick, mdiArrowUpThick, mdiArrowUpDownBold, mdiWindowShutterOpen, mdiWindowShutter } from '@mdi/js';
import config from '../config'
import toast from 'react-hot-toast';

function Control(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => {
       setShow(false); 
    }
    const handleShow = () => setShow(true);

    const [slider, setSlider] = useState(props.pos)

    const [loading, setLoading] = useState(false)

    const handleSlider = (e) => {
        setSlider(parseInt(e.target.value))
    }

    const handleToggle = async (percentage) => {

        toast.loading("Probíhají akce...", {
            duration: 3000}
        )

        setLoading(true)
        handleClose();

        try {
            const dToIn = {
                id: props.id,
                requiredPosition: percentage,
            };
  
            const response = await fetch(`${config.URI}/blinds/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dToIn),
            });
  
            if (response.ok) {
                props.fetchData();
                toast.success("Úspěšně změněno");
                setLoading(false)
            } else {
                setLoading(false)
                throw new Error('Chyba při ovládání žaluzií');
                
            }
        } catch (error) {
            toast.error("Chyba při ovládání žaluzií");
            setLoading(false)
            console.error('Chyba při ovládání žaluzií', error);
        }
    }; 

    return(
        <div className="Control">
            {props.pos <= 100 ? (
                <div>
                    {loading ? (<>
                        <Icon path={mdiWindowShutterOpen} size={6} color="lightgray"/> <h5><Spinner animation="border" role="status"/></h5>
                    </>):(<>
                        <Icon path={mdiWindowShutterOpen} size={6} color="gray"/> <h5>Vytáhnuté na {props.open}%</h5>
                    </>)}
                </div>
                ):(
                <div>
                    {loading ? (<>
                        <Icon path={mdiWindowShutter} size={6} color="lightgray" /> <h5><Spinner animation="border" role="status"/></h5>
                    </>):(<>
                        <Icon path={mdiWindowShutter} size={6} color="gray" /> <h5>Zatáhnuté</h5>
                    </>)}
                    
                </div>
            )}
            <Button className="ControlButtons" variant="outline-success" disabled={loading} onClick={() => handleToggle(100)}><Icon path={mdiArrowUpThick} size={3} /></Button>
            <Button className="ControlButtons" variant="outline-secondary" disabled={loading} onClick={handleShow}><Icon path={mdiArrowUpDownBold} size={3} /></Button>
            <Button className="ControlButtons" variant="outline-danger" disabled={loading} onClick={() => handleToggle(0)}><Icon path={mdiArrowDownThick} size={3} /></Button>

            <Modal show={show} onHide={handleClose} backdrop="static" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Nastavení polohy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br/>
                    <Form.Label>Poloha vytáhnutí</Form.Label><br/>
                    <Button variant="outline-primary" className="ModalButtons" onClick={() => handleToggle(0)}>0 %</Button>
                    <Button variant="outline-primary" className="ModalButtons" onClick={() => handleToggle(25)}>25 %</Button>
                    <Button variant="outline-primary" className="ModalButtons" onClick={() => handleToggle(50)}>50 %</Button>
                    <Button variant="outline-primary" className="ModalButtons" onClick={() => handleToggle(75)}>75 %</Button>
                    <Button variant="outline-primary" className="ModalButtons" onClick={() => handleToggle(100)}>100 %</Button>
                </Modal.Body>
                <Modal.Body>
                    <Stack direction="horizontal">
                       <Form.Label>Ruční nastavení</Form.Label>
                       <div className="p-2 ms-auto">{slider} %</div>
                    </Stack>
                    <Form.Range min={0} max={100} value={slider} onChange={handleSlider}/>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zrušit
                    </Button>
                    <Button variant="primary" onClick={() => handleToggle(slider)}>
                        Uložit a provést
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Control