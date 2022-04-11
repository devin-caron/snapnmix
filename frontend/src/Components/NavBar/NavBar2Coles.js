// import "./NavBar2.css";
// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { Component } from "react";
// import { MenuItems } from "./MenuItems";
// import { AccountItems } from "./MenuItems";
// import { NavItem, Button } from "react-bootstrap";

// class NavBar2 extends Component {
//   // history = useHistory();

//   state = { clicked: false };

//   handleClick = () => {
//     this.setState({ clicked: !this.state.clicked });
//   };
  
//   render() {
//     return (
//       <nav className="NavBarItems">
//         <h1 className="navbar-logo">Snap & Mix</h1>
//         <div className="menu-icon" onClick={this.handleClick}>
//           <i className={
//               this.state.clicked ? "fas fa-times fa-lg" : "fas fa-bars"
//             }></i>
//         </div>
//         <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
//           {MenuItems.map((item, index) => {
//             return (
//               <li key={index}>
//                 <a className={item.cName} href={item.url}>
//                   {item.title}
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//         <Button variant="custom2">Log In</Button>
//         <Button variant="custom2">Profile</Button>
//       </nav>
//     );
//   }
// }

// export default NavBar2;
