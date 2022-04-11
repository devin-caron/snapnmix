import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import StartPageLayout from "./Components/UI/StartPageLayout";
import Login from "./Components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, useHistory } from "react-router-dom";
import Home from "./Components/Home/Home"
import Scan from "./Components/Scan/Scan"
import Browse from "./Components/Browse/Browse"
import Community from "./Components/Community/Community"
import Account from "./Components/Account/Account"
import LaunchPage from "./Components/UI/LaunchPage"
import CocktailCard from "./Components/Cards/CocktailCard";
import CocktailDetails from "./Components/Cards/CocktailDetails";
import { useContext } from "react";
import AuthContext from "./Components/store/auth-context";
import NavBar2 from "./Components/NavBar/NavBar2";

let authtoken = "N/A";

function App() {
  let history = useHistory();
  const authCtx = useContext(AuthContext);

  const launchHandler = () => {
    setLaunchVisibility("");
    history.push("/login");
  };

  const [navigationBar, setNavigationBar] = useState(<NavBar2 />);
  const [navigationBar2, setNavigationBar2] = useState("");
  const [launchVisibility, setLaunchVisibility] = useState(
    <LaunchPage visible="true" handler={launchHandler} />
  );

  useEffect(() => {
    if (history.location.pathname != "/") {
      setLaunchVisibility("");
    }
  }, []);

  const authtokenHandler = (res) => {
    authtoken = res;
  };

  return (
    <div>
      {history.location.pathname === '/browse' || history.location.pathname === '/scan' || history.location.pathname === '/community' || history.location.pathname === '/account' || history.location.pathname === '/scan/cocktail-result' ? navigationBar2 : "" }
      {launchVisibility}
      <Route path="/login">
        <StartPageLayout>
          <Login authtokenpass={authtokenHandler} navBar={setNavigationBar2}/>
        </StartPageLayout>
      </Route>
      <Route path="/home">
        <Home navBar={setNavigationBar2} />
      </Route>
      <Route path="/scan">
        <Scan navBar={setNavigationBar2} />
      </Route>
      <Route exact path="/browse">
        <Browse navBar={setNavigationBar2} />
      </Route>
      <Route path="/Community">
        <Community navBar={setNavigationBar2} />
      </Route>
      <Route path="/account">
        <Account navBar={setNavigationBar2} />
      </Route>
    </div>
  );
}

export default App;
