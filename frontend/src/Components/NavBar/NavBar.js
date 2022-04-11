import "./NavBar.css";
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const NavBar = (props) => {
  const [navBarFeedback, setNavBarFeedback] = useState('bottomNavFeedbackLeft');
  let history = useHistory();

  useEffect(() => {
    if (history.location.pathname === '/scan') {
      setNavBarFeedback("bottomNavFeedbackMiddle");
    }
    if (history.location.pathname === '/community') {
      setNavBarFeedback("bottomNavFeedbackRight");
    }
    if (history.location.pathname === '/mybar') {
      setNavBarFeedback("bottomNavFeedbackLeft");
    }
  }, [])

  const myBarHandler = () => {
    setNavBarFeedback("bottomNavFeedbackLeft");
    history.push('/mybar');
  }

  const scanHandler = () => {
    setNavBarFeedback("bottomNavFeedbackMiddle");
    history.push('/scan');
  }

  const communityHandler = () => {
    setNavBarFeedback("bottomNavFeedbackRight");
    history.push('/community');
  }

  const backHandler = () => {
    if (history.location.pathname.length > 10){
      history.push('/community');
    } else {
      history.push('/home');
    }
  }

  if (props.Visibility === "visible") {
    return (
      <div>
        <div className="topNav">
          <h1>{props.title}</h1>
          <button className="navBackButton" onClick={backHandler}><ion-icon name="chevron-back-outline"></ion-icon></button>
        </div>
        <div className="bottomNav">
          <div className={navBarFeedback}></div>
          <button className='navMyBarButton' onClick={myBarHandler}><ion-icon name="wine"></ion-icon></button>
          <button className='navScanButton' onClick={scanHandler}><ion-icon name="camera"></ion-icon></button>
          <button className='navCommunityButton' onClick={communityHandler}><ion-icon name="people"></ion-icon></button>
        </div>
      </div>
    );
  }

  return <div></div>;
};

export default NavBar;
