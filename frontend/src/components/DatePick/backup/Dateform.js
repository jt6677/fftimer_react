import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SVGIcon from "../SVGIcon/SVGIcon";
import "../Auth/Signin";
function Dateform(props) {
  //   let x = " " + new Date();
  const [startDate, setStartDate] = useState(new Date());
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(startDate);
    // props.onSubmit(startDate);
  };
  return (
    <div className="fields">
      <label htmlFor="name">
        <SVGIcon className="icon" iconName="calendar" />
      </label>
      <form onSubmit={handleSubmit}>
        <DatePicker
          dateFormat="yyyyMMdd"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Dateform;
