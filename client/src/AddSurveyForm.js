import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button, Form, Alert, Row, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';
import { Redirect } from 'react-router-dom';
import ModalOpenQuestion from './ModalAddOpenQuestion.js';
import ModalClosedQuestion from './ModalAddClosedQuestion.js';


function AddSurveyForm(props) {

    return (
        <>
            <Col className="bg-light">
                <QuestionTable />
            </Col>

        </>);
}

function QuestionTable(props) {
    const [questions, setQuestions] = useState([]);

    const [surveyTitle, setSurveyTitle] = useState("");
    const [validationErrMsg, setValidationErrMsg] = useState("");


    //Modal openQuestion
    const [showOpenQuestion, setShowOpenQuestion] = useState(false);
    const handleCloseOpenQuestion = () => setShowOpenQuestion(false);
    const handleShowOpenQuestion = () => setShowOpenQuestion(true);

    //Modal closed Question
    const [showClosedQuestion, setShowClosedQuestion] = useState(false);
    const handleCloseClosedQuestion = () => setShowClosedQuestion(false);
    const handleShowClosedQuestion = () => setShowClosedQuestion(true);

    const handleSubmitSurvey = (event) => {
        //TODO: add some validation
        event.preventDefault();
        if (surveyTitle == "") {
            setValidationErrMsg("Title must not be empty");
            return;
        }
        if (questions.length == 0) {
            setValidationErrMsg("You must add at least one questoin");
            return;
        }
        API.sendNewSurvey({
            title: surveyTitle,
            questions: questions
        });
    }

    return (
        <>
            <p>{validationErrMsg}</p>
            {showOpenQuestion ? <ModalOpenQuestion show={showOpenQuestion} handleClose={handleCloseOpenQuestion}
                setQuestions={setQuestions}
                questions={questions}
            /> :
                ""}
            {showClosedQuestion ? <ModalClosedQuestion show={showClosedQuestion} handleClose={handleCloseClosedQuestion}
                setQuestions={setQuestions}
                questions={questions}
            /> :
                ""}
            <Form noValidate onSubmit={handleSubmitSurvey}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label> Title </Form.Label>
                    <Form.Control as="textarea"
                        type="text"
                        placeholder="Enter the title of the survey"
                        value={surveyTitle}
                        onChange={
                            (titleText) => {
                                setSurveyTitle(titleText.target.value);
                            }
                        }
                    />
                </Form.Group>
                {
                    questions.map(question =>
                        question.options === undefined ?
                            <OpenQuestionRow key={question.questionId}
                                question={question} setQuestions={setQuestions} questions={questions}
                            />
                            : <ClosedQuestionRow key={question.questionId}
                                question={question} setQuestions={setQuestions} questions={questions}
                            />



                    )
                }
                <Form.Group>
                    <Button onClick={
                        () => {
                            handleShowOpenQuestion();
                        }
                    }>Add new open question</Button>
                    <Button onClick={
                        () => {
                            handleShowClosedQuestion();
                        }
                    }> Add new closed question</Button>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">
                        Send Survey
                    </Button>
                </Form.Group>

            </Form>
        </>
    );


}

function OpenQuestionRow(props) {

    let questionTitle = props.question.title;
    if (props.question.mandatory)
        questionTitle += "\n (mandatory)";
    else
        questionTitle += "\n (optional)";
    return (
        <>  <Button size="sm" className="mr-2" variant="danger"
            onClick={() => {
                props.setQuestions(oldQuestions => oldQuestions.filter(q => q.questionId != props.question.questionId))
            }}>x</Button>
            {
                props.question.questionId == 0 ? <></> : <Button size="sm" variant="outline-primary" className="mr-2"
                    onClick={() => { }}>↑</Button>
            }
            {(props.question.questionId == (props.questions.length - 1)) ? <></> : <Button size="sm" variant="outline-primary" className="mr-2"
                onClick={() =>{ } }>↓</Button>
            }
            <Form.Label>{questionTitle}
            </Form.Label>
            
            <Form.Control as="textarea"
                rows={3}
                type="description"
                placeholder="Area for the answer"
                disabled
            />
        </>
    );
}

function ClosedQuestionRow(props) {
    let questionTitle = props.question.title + "   (maxAnswers: " + props.question.max + " minAnswers: " + props.question.min + ")";

    return (
        <>
            <Form.Group>
                <Form.Row>

                    <Button size="sm" variant="danger" className="mr-2"
                        onClick={() => {
                            props.setQuestions(oldQuestions => oldQuestions.filter(q => q.questionId != props.question.questionId))
                        }}>x</Button>
                    {props.question.questionId == 0 ? <></> : <Button size="sm" variant="outline-primary" className="mr-2"
                        onClick={() => { }}>↑</Button>}
                    {(props.question.questionId == (props.questions.length - 1)) ? <></> : <Button size="sm" variant="outline-primary" className="mr-2"
                        onClick={() => { }}>↓</Button>}
                    <text key={props.question.questionId}>
                        {questionTitle}
                    </text>
                    
                </Form.Row>

                {props.question.options.map(option =>
                    <Form.Check className="ml-5" type="checkbox" id="gridCheck3" disabled
                        label={option.text} />

                )}
            </Form.Group>

        </>
    )

}


export default AddSurveyForm;