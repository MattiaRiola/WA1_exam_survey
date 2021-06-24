import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, ListGroup } from 'react-bootstrap';


function AnswerSurvey(props) {
    return (
        <>
            <Col className="bg-light" >
                <h1>TODO: Insert the mandatory name and use it as use state to force it to be not empty before showing the questions</h1>
                <QuestionTable questions={JSON.parse(props.survey.questions)} />
            </Col>
        </>
    );
}

function QuestionTable(props) {
    return (
        <>
            <h3>Questions:</h3>
            <ListGroup as="ul" variant="flush">
                {props.questions.map(question =>
                    <QuestionRow
                        question={question}
                    />
                )

                }
            </ListGroup>
        </>
    );
}

function QuestionRow(props) {

    return (
        <>
            <ListGroup.Item as="li" variant="secondary">
                
                <h5>
                {props.question.title}
                </h5>

            </ListGroup.Item>
        </>
    );
}

export default AnswerSurvey;