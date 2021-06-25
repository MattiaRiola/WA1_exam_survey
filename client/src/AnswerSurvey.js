import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';



function AnswerSurvey(props) {



  const [answers, setAnswers] = useState([]);


    return (
        <>
            <Col className="bg-light" >
                <h5>TODO: Insert the mandatory name and use it as use state to force it to be not empty before showing the questions</h5>
                <QuestionTable questions={JSON.parse(props.survey.questions)} />
                <AnswersTable answers={answers} />
            </Col>
        </>
    );
}

function QuestionTable(props) {
    return (
        <>

            <h1>Questions:</h1>

            {props.questions.map(question =>
                <Form noValidate>

                    {
                        (question.options === undefined) ?
                            <OpenQuestionRow key={question.questionId} question={question} />
                            : <ClosedQuestionRow question={question} />
                    }
                    
                </Form>

            )

            }

        </>
    );
}

function OpenQuestionRow(props) {

    return (
        <>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{props.question.title}</Form.Label>
                <Form.Control as="textarea" rows={3} />
            </Form.Group>


        </>
    );
}

function ClosedQuestionRow(props) {

    return (
        <>

            <h3>
                {props.question.title}
            </h3>
            {props.question.options.map(option =>
                <Form.Row>

                <Form.Check inline type="checkbox" id="gridCheck3"
                />
                <text>{option.text}</text>
                </Form.Row>

            )}

        </>
    );
}

function AnswersTable(props){
    return (
    <>
    {props.answers.map(a => 
        <text>
            question n. {a.questionId}: {a.text === undefined ? a.selectedOptions : a.text}
        </text>
        )}
    </>
    );
}

export default AnswerSurvey;