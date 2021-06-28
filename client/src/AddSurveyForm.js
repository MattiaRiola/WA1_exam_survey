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
    const [questions, setQuestions] = useState([{ questionId: 0, title: "question1", mandatory: 0 }, { questionId: 1, title: "question2", mandatory: 0 },
    { questionId: 3, title: "closedQuestion3", min: 0, max: 1, options: [{ optionId: 0, questionId: 3, text: "option1" }, { optionId: 1, questionId: 3, text: "option2" }] }]);

    const [surveyTitle, setSurveyTitle] = useState("");

    //Modal openQuestion
    const [showOpenQuestion, setShowOpenQuestion] = useState(false);
    const handleCloseOpenQuestion = () => setShowOpenQuestion(false);
    const handleShowOpenQuestion = () => setShowOpenQuestion(true);

    //Modal closed Question
    const [showClosedQuestion, setShowClosedQuestion] = useState(false);
    const handleCloseClosedQuestion = () => setShowClosedQuestion(false);
    const handleShowClosedQuestion = () => setShowClosedQuestion(true);


    const handleSubmit = () => {
        console.log("TODO: do the submit of the survey");
    }

    return (
        <>
            {showOpenQuestion ? <ModalOpenQuestion show={showOpenQuestion} handleClose={handleCloseOpenQuestion}
            /> :
                ""}
            {showClosedQuestion ? <ModalClosedQuestion show={showClosedQuestion} handleClose={handleCloseClosedQuestion}
            /> :
                ""}
            <Form noValidate>
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
                                question={question}
                            />
                            : <ClosedQuestionRow key={question.questionId}
                                question={question}
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
        <>
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

                <p key={props.question.questionId}>
                    {questionTitle}
                </p>
                {props.question.options.map(option =>
                    <Form.Check type="checkbox" id="gridCheck3" disabled
                        label={option.text} />

                )}
            </Form.Group>

        </>
    )

}




function OLD_IN_MAIN_OpenQuestionO(props) {
    //     return(<Form.Group controlId="exampleForm.ControlTextarea1" key={question.questionId}>
    //     <Form.Label> {question.title} </Form.Label>
    //     <Form.Control as="textarea"
    //         type="title"
    //         placeholder="Enter the title of the survey"
    //         value={question.title}
    //         onChange={
    //             (questionTitleText) => {
    //                 setSurveyTitle((oldQuestions => {
    //                     return oldQuestions.map(q => {
    //                         if (q.questionId == question.questionId)
    //                             return { title: questionTitleText, questionId: question.questionId, }
    //                     })
    //                 }));
    //             }
    //         }
    //     />
    // </Form.Group>)
}

export default AddSurveyForm;