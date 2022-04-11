import react, { useState } from "react";
import "./SignInForm.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./SignUpForm.css";
import axios from "axios";
import { Link } from "react-router-dom";

const startUrl = "https://sandmbackendnew.herokuapp.com/"

const SignUpForm = (props) => {
  const [enteredUsername, setUsername] = useState("");
  const [enteredEmail, setEmail] = useState("");
  const [enteredPassword, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const registerHandler = (event) => {
    event.preventDefault();
    if (enteredUsername.length < 6){
      setErrorMsg('Username must be 6 or more characters!');
    } else if (enteredPassword.length < 6){
      setErrorMsg('Password must be 6 or more characters!');
    } else if (enteredEmail.trim().length > 0 && enteredPassword.trim().length > 0 && enteredUsername.trim().length > 0) {
      const registerInfo = {
        name: enteredUsername,
        email: enteredEmail,
        password: enteredPassword,
      };

      try {
        axios.post(startUrl + "api/user/register", registerInfo)
        .then(res => {
          if (res.data.success === false){
           setErrorMsg(res.data.message);
          }else{
           setErrorMsg('');
           console.log(res);
           props.registered();
          }
        })
        .catch(err => {
          console.log(err);
        })
     }catch{

     }
  } else{
    setErrorMsg("Fields can't be empty!")
    console.log("fields empty");
  }
}


  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  return (
    <div>
      <Form onSubmit={registerHandler}>
        <div className="innerForm-container">
          <div className="login-txt">
            <h2>Sign Up</h2>
            <p>{errorMsg}</p>
          </div>
          <div className="form-input">
            <Form.Control
              placeholder="Username"
              value={enteredUsername}
              onChange={usernameChangeHandler}
            />
          </div>
          <div className="form-input">
            <Form.Control
              type="email"
              placeholder="Email"
              value={enteredEmail}
              onChange={emailChangeHandler}
            />
          </div>
          <div className="form-input">
            <Form.Control
              type="password"
              placeholder="Password"
              value={enteredPassword}
              onChange={passwordChangeHandler}
            />
          </div>

          <Button variant="custom" type="Submit">
              SIGN UP
            </Button>
          <label className="signup-txt" onClick={props.returnLogin}>Already have any account? <span>Log In</span> </label>
        </div>
      </Form>
    </div>
  );
};

export default SignUpForm;
