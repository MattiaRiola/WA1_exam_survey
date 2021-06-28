import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import {  Button, Form } from 'react-bootstrap';
import {  useState } from 'react';



function ModalClosedQuestion(props) {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState(["", ""]); 
    //min 2 options in the question by default
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);
    const handleSubmitQuestion = (event) => {
        event.preventDefault();

        //TODO: some validation like in the handle submit in the questionTable in AnswerSurvey component
        let question = {
            questionId: props.questions.length,
            title: title,
            min: min,
            mandatory: min,
            max: max,
            options: options.map((o,i) => {return {optionId: i, text: o}})
        }
        props.setQuestions((oldQuestions)=>[...oldQuestions,question]);
    }
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Insert your closed question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmitQuestion}>
                        <Form.Label> Question title </Form.Label>
                        <Form.Control
                            required
                            rows={3}
                            type="description"
                            placeholder="Enter the text of your open question"
                            value={title}
                            onChange={
                                t => {
                                    setTitle(t.target.value);
                                }
                            }

                        />
                        <Form.Label> Max: </Form.Label>
                        <Form.Control as="select" type="select"
                            onChange={(t) => {
                                setMax(parseInt(t.target.value));
                            }}
                        >
                            {options.map(
                                (o, i) => {
                                    return (<><option>{i+1}</option>        </>)
                                }

                            )}

                        </Form.Control>
                        <Form.Label> Min: </Form.Label>
                        <Form.Control as="select" type="select"
                            onChange={(t) => {
                                setMin(parseInt(t.target.value));
                            }}
                        >
                            <option>0</option>
                            <option>1</option>

                        

                        </Form.Control>
                        {
                            options.map((option, i) => {
                                return (
                                    <>
                                        <Form.Label> {i} </Form.Label>
                                        <Form.Control
                                            key={i}
                                            required
                                            rows={2}
                                            type="description"
                                            placeholder="Enter the text of your option"
                                            value={option.text}
                                            onChange={
                                                t => {
                                                    setOptions(oldOptions => {
                                                        return oldOptions.map(
                                                            (oldO, j) => {
                                                                if (j === i) {
                                                                    return t.target.value;
                                                                }
                                                                else
                                                                    return oldO;
                                                            }
                                                        );
                                                    }
                                                    );
                                                }
                                            } />
                                    </>
                                )
                            }
                            )
                        }
                        <Button onClick={
                            () => {
                                setOptions(oldOptions => {

                                    return [...oldOptions, ""];
                                }
                                )
                            }
                        }>Add option</Button>
                        <Button type="submit">Add question</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );

}



export default ModalClosedQuestion