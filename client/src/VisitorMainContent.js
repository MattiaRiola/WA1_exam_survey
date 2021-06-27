import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function VisitorMainContent(props) {
  if (props.surveys === undefined)
    return (<></>);
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
      <h1>Surveys:</h1>
      <ListGroup as="ul" variant="flush">
        {props.surveys.map(survey =>
          <ActiveSurveyRow
            key={survey.survey_id}
            survey={survey}
          />
        )

        }
      </ListGroup>
    </>
  );
}

function ActiveSurveyRow(props) {

  return (
    <>
      <ListGroup.Item as="li" action variant="secondary">
        <Link to={"/survey/" + props.survey.survey_id}>
          {props.survey.title}
        </Link>
      </ListGroup.Item>
    </>
  );
}

export default VisitorMainContent;