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
import WatchAnswers from './WatchAnswers';
import AddSurveyForm from './AddSurveyForm';


function App() {

  /***  state variables for surveys */
  const [surveys, setSurveys] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);


  /*** Logged in */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');


  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
      setDirty(true);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      throw "Incorrect username and/or password";
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setDirty(true);
  }



  //Rehydrate tasks at mount time and when the variables change
  useEffect(() => {
    API.getUserInfo().then(user => {    /* I'm in the "then", the user is logged in ( the API returned an user info object) */
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: 'success' });  // we set it again here because otherwise when F5 the message created from LogIn disappears
    }).catch(error => {
      setLoggedIn(false); /* I'm on the "catch" so the API didn't give me the user */
    });


    // if (dirty) { //I will load the surveys only if they need to be rehydrate (dirty = true)
    if (loggedIn) {
      console.log("rehydrating admin's surveys, length = ", surveys.length)
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
      console.log("rehydrating all the surveys, length = ", surveys.length)

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

      // }

    }


  }, [loggedIn, surveys.length, dirty]);

  if (loading)
    return (<><h1>Loading...</h1></>)
  else
    return (
      <Router>
        <MyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
        <Container fluid>
          <Switch>

            <Route path="/survey/:survey_id" render={({ match }) =>
              <>{
                loggedIn ? <WatchAnswers surveys={surveys} surveyId={match.params.survey_id} survey={surveys.find((s) => s.survey_id == match.params.survey_id)} />
                  : <AnswerSurvey surveys={surveys} surveyId={match.params.survey_id} survey={surveys.find((s) => s.survey_id == match.params.survey_id)} />
              }</>
            } />
            <Route path="/login">
              <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
            </Route>
            <Route path="/newSurvey">
              <>{loggedIn ?  <AddSurveyForm/> : <Redirect to="/login" /> }</>
            </Route>
            <Route exact path="/">
              <>
                {loggedIn ?
                  <AdminMainContent surveys={surveys} />
                  : <VisitorMainContent surveys={surveys} />
                }
              </>
            </Route>
          </Switch>


        </Container>

      </Router>




    );
}

export default App;
