import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button, Form, Alert, Row, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';



function AnswerSurvey(props) {
    let voidAnswers = [];
    const [answers, setAnswers] = useState(voidAnswers);
    /**
     * 
     * @param {*} optionId  optionId selected
     * @param {*} questionId question related to that option
     * @param {*} toCheck if true -> add the option to the selectedOption vector
     *                    if fals -> delete the option to the selectedOption vector
     */
    const selectOption = (optionId, questionId, toCheck, max) => {
        setAnswers((oldAnswers) => {
            let newAnswers = oldAnswers.slice();
            if (toCheck) {
                if (newAnswers[questionId].selectedOptions.length < max)
                    if (!newAnswers[questionId].selectedOptions.includes(optionId))
                        newAnswers[questionId].selectedOptions = [...oldAnswers[questionId].selectedOptions, optionId];

            }
            else
                newAnswers[questionId].selectedOptions = oldAnswers[questionId].selectedOptions.filter(o => o != optionId);
            return newAnswers;
        }

        )
    }

    const [questions, setQuestions] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState();
    const [validationError, setValidationError] = useState("");

    const [visitorName, setVisitorName] = useState("");
    const [startAnswer, setStartAnswer] = useState(false);
    const submitVisitorName = () => {
        if (visitorName.length > 0)
            setStartAnswer(true);
    }

    useEffect(() => {
        if (props.surveys === undefined) {
            console.log("surveys is undefined so I can't fill the questions");
            return;
        }
        if (selectedSurvey === undefined && props.surveyId !== undefined)
            API.getSurveyById(props.surveyId).then(newS => {
                setSelectedSurvey(newS);
            })
                .catch(err => {
                    console.log(err);
                    setSelectedSurvey(undefined);
                });
        let voidAnswers = [];
        let tmpQuestions = [];
        if (selectedSurvey === undefined)
            return;
        for (let q of selectedSurvey.questions) {
            tmpQuestions.push(q);
            if (q.options === undefined)
                voidAnswers[q.questionId] = {
                    questionId: q.questionId,
                    text: ""
                };
            else
                voidAnswers[q.questionId] = {
                    questionId: q.questionId,
                    selectedOptions: []
                };
        }
        voidAnswers = voidAnswers.slice(1, voidAnswers.length);
        setQuestions(tmpQuestions);
        setAnswers(voidAnswers);
    }, [props.surveys.length, props.surveyId, questions.length, answers.length, selectedSurvey]);


    if (props.surveys === undefined || props.surveyId === undefined)
        return (<> <h1>Loading... surveys undefined</h1></>);
    else
        if (props.survey === undefined)
            return (<> <h1>Loading... selected survey undefined</h1> </>);
        else {
            return (

                <>{startAnswer ?
                    (<Col className="bg-light" >
                        {validationError.length > 0 ? <Alert variant={"danger"}>{validationError}</Alert> : <></>}
                        <QuestionTable surveys={props.surveys} questions={questions} survey={props.survey} selectOption={selectOption}
                            visitorName={visitorName} answers={answers} setAnswers={setAnswers} setValidationError={setValidationError} />
                        {validationError.length > 0 ? <AnswersTable answers={answers} /> : <></>}
                    </Col>)
                    : (<NameForm submitVisitorName={submitVisitorName} visitorName={visitorName} setVisitorName={setVisitorName} />)
                }
                </>

            );
        }
}

function QuestionTable(props) {
    const handleSubmit = (event) => {
        //validation for the max 200 chars or max number of option selected of each answer can be done here
        // but the validation in this case is implicit in the construction of the answers vector
        event.preventDefault();
        const form = event.currentTarget;
        let validationError = "";
        for (let q of props.questions) {
            if (q.options !== undefined) {
                if (q.min > 0 && props.answers[q.questionId - 1].selectedOptions.length < 1)
                    validationError += ("question number " + q.questionId + " is required, please give an answer\n");
            } else {
                if (q.mandatory == 1 && props.answers[q.questionId - 1].text.length < 1)
                    validationError += ("question number " + q.questionId + " is required, the text must not be empty\n");
            }
        }
        if (validationError == "") {
            API.sendAnswers(
                props.answers,
                props.survey.survey_id,
                props.visitorName

            )
        }
        props.setValidationError(validationError);
    }


    if (props.questions === undefined)
        return (<><h1>Loading questions...</h1></>);
    else
        return (
            <>

                <h1>Questions:</h1>

                <Form noValidate onSubmit={handleSubmit}>

                    {props.questions.map(question =>
                        <Form.Group controlId="exampleForm.ControlTextarea1" key={question.questionId}>

                            {
                                (question.options === undefined) ?
                                    <OpenQuestionRow key={question.questionId} question={question} questionId={question.questionId - 1} answers={props.answers} setAnswers={props.setAnswers} />
                                    : <ClosedQuestionRow key={question.questionId} questionId={question.questionId}
                                        question={question} answers={props.answers}
                                        setAnswers={props.setAnswers} selectOption={props.selectOption} />
                            }
                        </Form.Group>



                    )

                    }
                    <Button type="submit">Send answers</Button>
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
            <Form.Label>{questionTitle} {props.question.max}
            </Form.Label>
            <Form.Control as="textarea"
                rows={3}
                type="description"
                placeholder="Enter your answer here"
                value={props.answers[props.question.questionId] === undefined ? "" : props.answers[props.questionId].text}
                onChange={
                    answerText => {
                        if (answerText.target.value.length > 200) {
                            return;
                        }
                        props.setAnswers(oldAnswers => {
                            return oldAnswers.map(a => {
                                if (a.questionId == props.question.questionId)
                                    return { text: answerText.target.value, questionId: a.questionId };
                                else
                                    return a;
                            });
                        }
                        )
                    }
                }
            />



        </>
    );
}

function ClosedQuestionRow(props) {
    let questionTitle = props.question.title+"   (maxAnswers: "+props.question.max+" minAnswers: "+props.question.min+")";

    return (
        <>

            <p key={props.question.questionId}>
                {questionTitle}
            </p>
            {props.question.options.map(option =>
                <Form.Row key={option.optionId}>
                    <QuestionOption
                        question={props.question}
                        questionId={props.questionId - 1}
                        option={option}
                        answers={props.answers}
                        setAnswers={props.setAnswers}
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
        if (props.answers[props.questionId] === undefined)
            return (<> <h1>Loading answers[props.questionId]</h1></>);
    if (props.answers[props.questionId].selectedOptions === undefined)
        return (<><h1> Loading selected options length</h1></>);
    else
        return (
            <>
                <Form.Check inline type="checkbox" id="gridCheck3"
                    checked={props.answers[props.questionId].selectedOptions.includes(props.optionId) ? true : false

                    }
                    onChange={(td) => {
                        props.selectOption(props.optionId, props.questionId, td.target.checked, props.question.max);

                    }}
                />
            </>);
}

function AnswersTable(props) {
    return (
        <>
            <h3>given answers: </h3>
            {props.answers.map(a =>
                <p key={a.questionId} >
                    question n. {a.questionId}:
                    {a.text === undefined ? ("selected options: [ " + a.selectedOptions + " ]") : a.text}
                </p>
            )}
        </>
    );
}

function NameForm(props) {
    const [warning, setWarning] = useState(false);
    const handleSubmit = (event) => {

        if (props.visitorName.length == 0) {
            setWarning(true)
        }
        else {
            props.submitVisitorName();
        }

    };

    return (
        <>
            <Container>
                {warning ? (<Row className="justify-content-md-center"><Alert variant={"danger"}>Name is mandatory </Alert> </Row>) : <></>}
                <Row className="justify-content-md-center">
                    <Form noValidate onSubmit={handleSubmit} >

                        <Form.Group controlId="formBasicDescrption">
                            <Form.Label>Enter your name</Form.Label>
                            <Form.Control
                                type="user"
                                required
                                placeholder="Enter your name here"
                                value={props.visitorName}
                                onChange={
                                    answerText => {
                                        props.setVisitorName(answerText.target.value);
                                    }
                                }
                            />
                        </Form.Group>

                         {props.visitorName.length > 0 ?  <Button type="submit">Start survey</Button>: ""}
                    </Form>
                </Row>
            </Container>

        </>
    );

}

export default AnswerSurvey;