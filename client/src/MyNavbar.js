import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import surveylogo from './journal-text.svg';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { LoginButton,LogoutButton } from './LoginComponents';



function MyNavbar(props) {
    return (
        <>
            <Navbar bg="dark" variant="dark" className="sticky-top d-flex justify-content-between">
                <Navbar.Brand href="/" className="d-inline-block align-top">
                    <img alt="" src={surveylogo} width="30" height="30" className="d-inline-block align-top" />{' '} Surveys - Exam1 WA1
                </Navbar.Brand>

                <Navbar.Text className="text-white">
                    {props.loggedIn ? props.message.msg : ""}
                </Navbar.Text>
                <>
                {props.loggedIn ? 
                    <LogoutButton logout={props.logout} ></LogoutButton> 
                :<Link to="/login"> <LoginButton></LoginButton></Link>
                }
                </>
            </Navbar>
        </>
    );
}

export default MyNavbar;