import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';
import { useEffect, useState } from 'react';
import { Col, Button, Form, Alert, Row, Container } from 'react-bootstrap';


function WatchAnswers(props) {
    const [answers, setAnswers] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (props.surveyId !== undefined)
            API.getAnswersBySurveyId(props.surveyId).then(
                newA => {
                    setAnswers(newA);
                    setLoading(false);
                }
            ).catch(err => {
                console.log(err);
                setAnswers([]);
                setLoading(false);
            }
            );
    }, [props.surveyId]);

    if (answers.length == 0)
        return (<>{loading ? <h1>Loading answers</h1> : <h1>answers not found</h1>}</>);
    else {
        if (props.survey == undefined)
            return (<><h1>Loading... survey</h1></>);
        else
            return (<>
                <h1>{props.survey.title}</h1>
                <h2>{answers[index].name}</h2>
                <Row className="bg-light my-2 ml-4">
                    <AnswersTable
                        questions={props.survey.questions}
                        visitorName={answers[index].name}
                        visitorAnswers={answers[index].answers}
                    />
                </Row>
                <Row className>
                    <Col>
                        {index == 0 ? "" : <Button onClick={() => {
                            setIndex(old =>
                                old - 1)
                        }}>Last</Button>}
                    </Col>
                    <Col>
                    {index >= answers.length-1 ? "" :<Button onClick={
                            () => {
                                setIndex(old =>
                                    old + 1)
                            }}>Next</Button>}
                    </Col>

                </Row>
            </>)
    }
}

function AnswersTable(props) {
    if (props.questions == undefined || props.visitorAnswers == undefined || props.visitorName == undefined)
        return (<> <h1>Loading ... answers of the visitor</h1></>);
    else
        return (<>
            <Col>
                <Form noValidate>
                    {props.questions.map(question =>
                        <Form.Group controlId="exampleForm.ControlTextarea1" key={question.questionId}>
                            {
                                (question.options === undefined) ?
                                    <OpenQuestionRow key={question.questionId}
                                        question={question}
                                        answer={props.visitorAnswers.find(a => a.questionId == question.questionId)}
                                    />
                                    : <ClosedQuestionRow key={question.questionId} questionId={question.questionId}
                                        question={question}
                                        answer={props.visitorAnswers.find(a => a.questionId == question.questionId)}
                                    />
                            }
                        </Form.Group>
                    )}
                </Form>
            </Col>

        </>)
}
function OpenQuestionRow(props) {

    return (<>
        <Form.Label>{props.question.title}
        </Form.Label>
        <Form.Control as="textarea"
            rows={3}
            readOnly
            type="description"
            placeholder="Void answer"
            value={props.answer === undefined ? "loading... answer" : props.answer.text}

        />
    </>)
}

function ClosedQuestionRow(props) {
    return (
        <>

            <p key={props.question.questionId}>
                {props.question.title}
            </p>
            {props.question.options.map(option =>
                <Form.Row key={option.optionId}>
                    <QuestionOption
                        question={props.question}
                        questionId={props.questionId}
                        option={option}
                        answer={props.answer}
                        optionId={option.optionId}

                        selectOption={props.selectOption}
                    />
                    <p>{option.text}</p>
                </Form.Row>

            )}

        </>
    );
}


function QuestionOption(props) {
    if (props.questionId === undefined)
        return (<> <h1>Loading questionId</h1></>);
    else
        if (props.answer === undefined)
            return (<> <h1>Loading answers[props.questionId]</h1></>);
    if (props.answer.selectedOptions === undefined)
        return (<><h1> Loading selected options length</h1></>);
    else
        return (
            <>
                <Form.Check inline type="checkbox" id="gridCheck3" disabled
                    checked={props.answer.selectedOptions.includes(props.optionId) ? true : false
                    }

                />
            </>);
}
export default WatchAnswers;