import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './MyNavbar.js';
import { LoginForm, LogoutButton } from './LoginComponents';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import API from './API.js';
import AdminMainContent from './AdminMainContent';
import VisitorMainContent from './VisitorMainContent';


function App() {

  /*** Logged in */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');


  /** Ask server if user is logged in everytime the page is mounted. This information is stored in the cookie of the session */
  useEffect(() => {
    API.getUserInfo().then(user => {    /* Se sono nel then, l'utente è loggato (l'API ritorna un oggetto contenente user info) */
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });  // we set it again here because otherwise when F5 the message created from LogIn disappears
    }).catch(error => {
      setLoggedIn(false);              /* Se sono nella catch l'API non ha restituito un utente, dunque non è loggato */
    });
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
    // TODO: clean up everything
  }


  return (
    <Router>
      <MyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
      <Container fluid>
        <Row className="row-height">
          <Switch>
          
          <Route path="/login">
            <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
          </Route>

          <Route exact path="/">
          <>
            {loggedIn ? 
            <AdminMainContent />
            : <VisitorMainContent/> 
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
