import './App.css';

//LIBRARIES
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';

//COMPONENTS
import API from './API.js';
import { LoginForm } from './LoginComponents';
import MyNavbar from './MyNavbar.js';
import AdminMainContent from './AdminMainContent';
import VisitorMainContent from './VisitorMainContent';
import AnswerSurvey from './AnswerSurvey';


function App() {

  /***  state variables for surveys */
  const [surveys, setSurveys] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);


  /*** Logged in */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');


  /** This use effect is called only once at mount time */
  /** Ask server if user is logged in everytime the page is mounted. This information is stored in the cookie of the session */
  useEffect(() => {
    //START LOAD USER INFO
    API.getUserInfo().then(user => {    /* I'm in the "then", the user is logged in ( the API returned an user info object) */
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: 'success' });  // we set it again here because otherwise when F5 the message created from LogIn disappears
    }).catch(error => {
      setLoggedIn(false);              /* I'm on the "catch" so the API didn't give me the user */
    });
    //END LOAD USER INFO


    //START LOAD SURVEYS
    if (loggedIn) {
      API.getSurveysByAdmin().then(newS => {
        let result = [];
        newS.forEach(survey => {
          result.push(survey);
        });
        setDirty(false);
        setSurveys(result);
        setLoading(false);
      })
        .catch(err => {
          console.log(err);
          //this must be the right order in this way I wont send more than 1 request to the server
          // setting Dirty the if will be false
          setDirty(false);
          setSurveys([]);
          setLoading(false);
        });
    }
    else {

      API.getAllSurveys().then(newS => {
        let result = [];
        newS.forEach(survey => {
          result.push(survey);
        });
        console.log(result);
        setDirty(false);
        setSurveys(result);
        setLoading(false);
      })
        .catch(err => {
          console.log(err);
          //this must be the right order in this way I wont send more than 1 request to the server
          // setting Dirty the if will be false
          setDirty(false);
          setSurveys([]);
          setLoading(false);
        });
    }
    //END LOAD SURVEYS
  }, []); // only at mount time

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      throw "Incorrect username and/or password";
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  }


  //Rehydrate tasks at mount time and when the variables change
  useEffect(() => {
    console.log("rehydrating [loggedIn] the surveys, length = ", surveys.length)
    if (dirty) { //I will load the surveys only if they need to be rehydrate (dirty = true)
      if (loggedIn) {
        API.getSurveysByAdmin().then(newS => {
          let result = [];
          newS.forEach(survey => {
            result.push(survey);
          });
          setDirty(false);
          setSurveys(result);
          setLoading(false);
        })
          .catch(err => {
            console.log(err);
            //this must be the right order in this way I wont send more than 1 request to the server
            // setting Dirty the if will be false
            setDirty(false);
            setSurveys([]);
            setLoading(false);
          });
      }
      else {
        API.getAllSurveys().then(newS => {
          let result = [];
          newS.forEach(survey => {
            result.push(survey);
          });
          setDirty(false);
          setSurveys(result);
          setLoading(false);
        })
          .catch(err => {
            console.log(err);
            //this must be the right order in this way I wont send more than 1 request to the server
            // setting Dirty the if will be false
            setDirty(false);
            setSurveys([]);
            setLoading(false);
          });

      }

    }


  }, [loggedIn, surveys.length, dirty]);

  
  return (
    <Router>
      <MyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
      <Container fluid>
        <Row className="row-height">
          <Switch>

            <Route path="/survey/:survey_id" render={({ match }) =>
              <>{
                loggedIn ? <Redirect to="/" />
                  : <AnswerSurvey surveys={surveys} surveyId={match.params.survey_id} survey={surveys.find((s) => s.survey_id == match.params.survey_id)} />
              }</>
            } />
            <Route path="/login">
              <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
            </Route>

            <Route exact path="/">
              <>
                {loggedIn ?
                  <AdminMainContent />
                  : <VisitorMainContent surveys={surveys} />
                }
              </>
            </Route>
          </Switch>

        </Row>
      </Container>

    </Router>




  );
}

export default App;
