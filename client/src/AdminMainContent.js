import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



function AdminMainContent(props) {
  if (props.surveys === undefined)
    return (<></>)
  else
    return (
      <>
        <Col className="bg-light" >

          <ActiveSurveyTable surveys={props.surveys} />
        </Col>
      </>
    );
}

function ActiveSurveyTable(props) {
  return (
    <>
      <h1>your surveys:</h1>
      <ListGroup as="ul" variant="flush">
        {props.surveys.map(survey =>
          <ActiveSurveyRow
            key={survey.survey_id}
            survey={survey}
          />
        )

        }
      </ListGroup>
      <Link to="/newSurvey"> <Button>New survey</Button></Link>
      </>
  );
}

function ActiveSurveyRow(props) {
  let surveyTitleString = props.survey.title + " (num answers:  " + props.survey.answers_number + ")";
  return (
    <>
      <ListGroup.Item as="li" action variant="secondary">
        <Link to={"/survey/" + props.survey.survey_id}>
          {surveyTitleString}
        </Link>
      </ListGroup.Item>
    </>
  );
}

export default AdminMainContent;