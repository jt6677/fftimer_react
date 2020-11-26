import React, { Component } from "react";
import "./DatePick.css";

import server from "../../apis/server";
import ReduxForm from "../ReduxForm/ReduxForm.js";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";

export class DatePick extends Component {
  onSubmit(formValues) {
    // console.log(formValues);
    // // let bbb = formValues;
    // const signUp = async () => {
    //   const response = await server.post("/signup", formValues);
    //   console.log(response.data);
    // };
    // signUp();
    console.log(formValues);
  }

  dateDefault() {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    let today = year + "-" + month + "-" + day;

    return `${today}`;
  }

  render() {
    // let date = new Date();

    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();

    // if (month < 10) month = "0" + month;
    // if (day < 10) day = "0" + day;

    // let today = year + "-" + month + "-" + day;

    return (
      <div className="main-body">
        <Fallfowardpage showWisdom={true} />
        <div>
          <ReduxForm
            initialValues={{ date: this.dateDefault() }}
            onSubmit={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}

export default DatePick;
