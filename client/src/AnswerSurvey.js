import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import API from './API.js';


/**
 * 
 * @param {*} props survey = 
    * {
    *  survey_id,
    *  user_id,
    *  title,
    *  questions = {
    *      questionId,
    *      surveyId
    *      title,
    *      mandatory,
    *      
    *      (if closedQuestion): 
    *          min,max, options = {
    *              optionId,
    *              questionId,
    *              surveyId,
    *              text
    *              }
    *      (if openQuestion):
    *       text 
    *  }
    * } 
 */
function AnswerSurvey(props) {
    let voidAnswers = [];
    // for (let q of JSON.parse(props.survey.questions)) {
    //     if (q.options === undefined)
    //         voidAnswers[q.questionId] = {
    //             questionId: q.questionId,
    //             text: ""
    //         };
    //     else
    //         voidAnswers[q.questionId] = {
    //             questionId: q.questionId,
    //             selectedOptions: []
    //         };
    // }
    const [answers, setAnswers] = useState(voidAnswers);
    const [questions, setQuestions] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState();
    /**
     * answers = [
     *  {
     *      questionId,
     *      (if closedQuestion)
     *          selectedOptions = [array of integer (optionId)]
     *      (if openQuestion)
     *          text
     *  },
     *  ...
     * ]
     */

    useEffect(() => {
        console.log("Trying to fill the questions of survey_id = " + props.surveyId);
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
        setQuestions(tmpQuestions);
        setAnswers(voidAnswers);
    }, [props.surveys.length, props.surveyId, questions.length, answers.length, selectedSurvey]);



    return (

        <>
            (<Col className="bg-light" >
                <h5>TODO: Insert the mandatory name and use it as use state to force it to be not empty before showing the questions</h5>
                <QuestionTable surveys={props.surveys} questions={questions}
                    answers={answers} setAnswers={setAnswers} />
                <AnswersTable answers={answers} />
            </Col>)

        </>

    );
}

function QuestionTable(props) {
    const handleSubmit = () => {
        console.log("TODO: implement Handle submit and validators during the submit ")
    }



    return (
        <>

            <h1>Questions:</h1>

            <Form noValidate onSubmit={handleSubmit}>

                {props.questions.map(question =>
                    <Form.Group controlId="exampleForm.ControlTextarea1" key={question.questionId}>

                        {
                            (question.options === undefined) ?
                                <OpenQuestionRow key={question.questionId} question={question} answers={props.answers} setAnswers={props.setAnswers} />
                                : <ClosedQuestionRow key={question.questionId} question={question} answers={props.answers} setAnswers={props.setAnswers} />
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
    return (
        <>

            <Form.Label>{props.question.title}</Form.Label>
            <Form.Control as="textarea"
                rows={3}
                type="description"
                placeholder="Enter your answer here"
                value={props.answers[props.question.questionId] === undefined ? "" : props.answers[props.question.questionId].text}
                onChange={
                    answerText => {
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

    return (
        <>

            <h5>
                {props.question.title}
            </h5>
            {props.question.options.map(option =>
                <Form.Row key={option.optionId}>
                    {

                        (props.question.title !== undefined
                    /**TODO: sostituire questa condizione con:
                     * props.answers.find(props.question.questionId).length < props.question.max  && props.answers[props.question.questionId].selectedOptions.find(option.optionId)*/) ?
                            <QuestionOption question={props.question} option={option} answers={props.answers} />
                            :
                            //TODO: caso in cui il ho già dato il num max di risposte
                            (<Form.Check inline type="checkbox" id="gridCheck3" disabled />)
                    }
                    <p>{option.text}</p>
                </Form.Row>

            )}

        </>
    );
}

function QuestionOption(props) {

    return (
        <>
            <Form.Check inline type="checkbox" id="gridCheck3"
                onChange={() => {
                    //TODO: Add the selected option
                }}
            />
        </>);
}

function AnswersTable(props) {
    return (
        <>
            <h1>Answers: </h1>
            {props.answers.map(a =>
                <p >
                    question n. {a.questionId}:
                    {a.text === undefined ? a.selectedOptions : a.text}
                </p>
            )}
        </>
    );
}

export default AnswerSurvey;