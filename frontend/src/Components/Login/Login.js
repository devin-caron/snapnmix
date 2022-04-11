import React, { useEffect, useState } from "react";
import "./Login.css";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Login = (props) => {
  const [newSignUp, setNewSignUp] = useState(false);
  const [regMsg, setRegMsg] = useState('');

  const userVerifiedHandler = (userState) => {};

  const authtokenHandler = (res) =>{
    props.authtokenpass(res);
  }

  const signUpHandler = () => {
    if (newSignUp === false){
      setNewSignUp(true);
      setRegMsg("");
    } else {
      setNewSignUp(false);
      setRegMsg("Register Complete! You may sign in!")
    }
  };

  const backHandler = () =>{
    setNewSignUp(false);
  }

  useEffect(()=>{
    props.navBar();
  },[]);

  if (newSignUp === true) {
    return (
      <React.Fragment>
      <div className="form-container">
        <div className="logo">
        <img className="loginBrand" src="SnapAndMixLogo.png"></img>
        </div>
        <SignUpForm registered={signUpHandler} returnLogin={backHandler}/>
        
      </div>
      <div className="developerSignature">
        <p className="developedbyText">Developed By</p>
        <img className="companyBrand" src="Scan5Logo.png"></img>
      </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
      <div className="form-container">
        <div className="logo">
          <img className="loginBrand" src="SnapAndMixLogo.png"></img>
        </div>
        <SignInForm
          onUserVerified={userVerifiedHandler}
          onSignUp={signUpHandler}
          regMsg={regMsg}
          authtokenpass={authtokenHandler}
        />
      </div>
      <div className="developerSignature">
        <p className="developedbyText">Developed By</p>
        <img className="companyBrand" src="Scan5Logo.png"></img>
      </div>
      </React.Fragment>
    );
  }
};

export default Login;
