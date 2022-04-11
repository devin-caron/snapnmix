import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading_icon_container">
      <svg>
        <circle cx="70" cy="70" r="70"></circle>
      </svg>
      <h1 className="loading_text">Loading...</h1>
    </div>
  );
};

export default Loading;
