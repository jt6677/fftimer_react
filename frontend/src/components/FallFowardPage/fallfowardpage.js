import React from "react";
import IntotheWild from "../../assets/circle250.png";
import "./fallfowardpage.css";

const renderWisdom = (showWisdom) => {
  if (showWisdom) {
    return (
      <div>
        <p className="wisdom-line__One">"Drop By Drop,</p>
        <p className="wisdom-line__Two"> "The Bucket Will Be Filled."</p>
      </div>
    );
  }
};
function Fallfowardpage({ showWisdom }) {
  return (
    <div>
      <div>
        <div className=" logo-container">
          <img className="logo" src={IntotheWild} alt="FallForward" />
        </div>
        <h1 className="slogon">Fall Forward</h1>
      </div>
      {renderWisdom(showWisdom)}
    </div>
  );
}

export default Fallfowardpage;
