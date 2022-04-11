import React, { useState, useContext } from "react";
import "./SignInForm.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink, useHistory } from 'react-router-dom'
import AuthContext from "../store/auth-context"
import axios from "axios";

const startUrl = "https://sandmbackendnew.herokuapp.com/"

let state = {
  response: String
}; 

const SignInForm = (props) => {
  let history = useHistory();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const authCtx = useContext(AuthContext);

  const guestLoginHandler = () => {
    authCtx.logout();
  };

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const signUpHandler = () => {
    props.onSignUp();
  };

  const signInHandler = async (event) => {
    event.preventDefault();

    if (enteredEmail.trim().length > 0 && enteredPassword.trim().length > 0) {
      const loginInfo = {
        email: enteredEmail,
        password: enteredPassword,
      };


      // API CODE
      // ========================================================================================
      // Send http get request to API
      try {
         axios.post(startUrl + "api/user/login", loginInfo)
         .then(res => {
           if (res.data.success === false){
            setErrorMsg(res.data.message);
           }else{
            setErrorMsg('');
            authCtx.login(res.data.token);
            props.authtokenpass(res.data);
            history.push('/browse');
           }
         })
         .catch(err => {
           console.log(err);
         })
      } catch (error) {
        // Error handle
      }
      //========================================================================================
    } else {
      setErrorMsg("Fields cannot be empty!")
      return;
    }
  };

  return (
    <div>
      <Form onSubmit={signInHandler}>
        <div className="innerForm-container">
          <div className="login-txt">
            <h2>Log In</h2>
            <p>{errorMsg}</p>
            <label className="successMsg">{props.regMsg}</label>
          </div>
          <div className="txt-input">
            <Form.Control
              type="email"
              placeholder="Email"
              value={enteredEmail}
              onChange={emailChangeHandler}
            />
          </div>
          <div>
            <Form.Control
              type="password"
              placeholder="Password"
              value={enteredPassword}
              onChange={passwordChangeHandler}
            />
          </div>
          <div className="txt-input">
            <Button variant="custom" type="Submit">
              LOGIN
            </Button>
          </div>
          <div>
            <label>Or</label>
          </div>
          <NavLink onClick={guestLoginHandler} className="guestLink" to='/browse'>Continue as <span>Guest</span></NavLink>
          <div>
            <label onClick={signUpHandler} className="signup-txt">
              New here? <span>Sign up</span>
            </label>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignInForm;
