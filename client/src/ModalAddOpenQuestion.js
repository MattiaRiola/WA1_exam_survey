
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import { Col, Button, Form, Alert, Row, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';
import { Redirect } from 'react-router-dom';

function ModalOpenQuestion(props) {
    const [question, setQuestion] = useState();
    const [title, setTitle] = useState("");
    const [mandatory, setMandatory] = useState(0);
    const handleSubmit = () => {
        console.log("TODO: Handle submit question");
    }

    return (<>

        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>TODO: Closed question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label> Question title </Form.Label>
                        <Form.Control
                            required
                            type="description"
                            placeholder="Enter the text of your open question"
                            value={title}
                            onChange={
                                t => {
                                    setTitle(t.target.value);
                                }
                            }

                        />
                        <Form.Row>
                            <Form.Check inline type="checkbox" id="gridCheck3"
                                checked={mandatory}
                                label="Mandatory"
                                onChange={(t) => {
                                    setMandatory(old => !old);

                                }}
                            />
                        </Form.Row>
                        <Button type="submit">Add question</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    </>)

}




export default ModalOpenQuestion