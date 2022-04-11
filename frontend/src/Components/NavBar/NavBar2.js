import "./NavBar2.css";
import { Nav, Navbar, Button } from "react-bootstrap";
import { useHistory } from 'react-router-dom'
import AuthContext from "../store/auth-context";
import { useEffect, useState, useContext } from "react";
import logo from "./SnapAndMixLogo.png"
import { propTypes } from "react-bootstrap/esm/Image";

const NavBar2 = (props) => {
    let history = useHistory();

    const [activePage, setActivePage] = useState(history.location.pathname);
    const authCtx = useContext(AuthContext);


    const browseLinkHandler = () =>{
        history.push("/browse");
        setActivePage("/browse");
    }

    const scanLinkHandler = () =>{
        history.push("/scan");
        setActivePage("/scan");
    }

    const communityLinkHandler = () =>{
        history.push("/community");
        setActivePage("/community");
    }

    const accountLinkHandler = () =>{
        history.push("/account");
        setActivePage("/");
    }

    const loginLinkHandler = () =>{
      history.push("/login");
      setActivePage("/");
  }

    useEffect(() => {
      setActivePage(history.location.pathname);
    },[history.location.pathname]);

  return (
    <div className="navBar2Container">
      <Navbar bg="NavBarItems" variant="custom" expand="lg">
          <Navbar.Brand>
            <img onClick={browseLinkHandler} className="navbarBrand" src={logo}></img>
          </Navbar.Brand>

          <Navbar.Toggle />
            <Navbar.Collapse>
            <Nav>
            <Nav.Link onClick={browseLinkHandler}><label className={activePage === "/browse" ? "navLabelsActive" : "navLabels"}>Browse</label></Nav.Link>
            <Nav.Link onClick={scanLinkHandler}><label className={activePage === "/scan" ? "navLabelsActive" : activePage === "/scan/cocktail-result" ? "navLabelsActive" : "navLabels"}>Scan</label></Nav.Link>
            <Nav.Link onClick={communityLinkHandler}><label className={activePage === "/community" ? "navLabelsActive" : "navLabels"}>Community</label></Nav.Link>
            <div className="navbarLinkButtons">
            {authCtx.isLoggedIn ? <Button variant="custom2" onClick={accountLinkHandler}>Account</Button> : <Button variant="custom2" onClick={loginLinkHandler}>Log In</Button>}
            </div>
            </Nav>
            </Navbar.Collapse>

      </Navbar>
    
    </div>
  );
};

export default NavBar2;
