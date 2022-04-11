import "./Account.css";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import AuthContext from "../store/auth-context";
import { propTypes } from "react-bootstrap/esm/Image";
import axios from "axios";

const startUrl = "https://sandmbackendnew.herokuapp.com/";
let USER_DATA = [];

const Account = (props) => {
  const [userData, setUserData] = useState([
    {
      name: "",
      email: "",
    },
  ]);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const logOutHandler = () => {
    authCtx.logout();
  };

  useEffect(() => {
    try {
      axios
        .get(startUrl + "api/user/info", {
          headers: { "auth-token": authCtx.token },
        })
        .then((res) => {
          USER_DATA = res.data.data;
          setUserData(USER_DATA);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("fail");
    }
  }, []);

  return (
    <div className="accountPageContainer">
      <div className="accountForm">
        <div className="accountFormUserName">
          <div className="accountFormHeader">{userData.name}</div>
          <div className="accountFormEmail">{userData.email}</div>
        </div>
        <div className="accountUserStatsContainer">
          <div className="accountStatBox_favourited">
            <span className="accountStatCount_favourited">{userData.favoriteCount}</span>Favourited
            Drinks
            <span className="accountStat_favourited_outline"></span>
          </div>
          <div className="accountStatBox_created">
            <span className="accountStatCount_created">{userData.customCount}</span>Created Drinks
            <span className="accountStat_created_outline"></span>
          </div>
        </div>
        <Button variant="logOutButton" href="/login" onClick={logOutHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Account;
