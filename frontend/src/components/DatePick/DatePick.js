import React, { useState, useContext, useEffect } from "react";
import { publicFetch } from "../../util/fetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SVGIcon from "../SVGIcon/SVGIcon";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import Fallfowardpage from "../FallFowardPage/fallfowardpage";
import SessionTable from "../SessionTable/SessionTable";
import { Link } from "react-router-dom";
const DatePick = () => {
  const [selecteddate, setSelecteddate] = useState(new Date());
  const authContext = useContext(AuthContext);

  const submitDate = async () => {
    let formatedDate = moment(selecteddate).format("YYYYMMDD");
    let link = `/dailysession/${formatedDate}`;
    let config = {
      url: link,
      method: "post",
      withCredentials: true,
    };
    try {
      const data = await publicFetch.request(config);

      authContext.setSessiontableState(data.data);
      // history.push(`/date/${formatedDate}`);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    <SessionTable history={authContext.sessiontableState} />;
    return () => {
      <SessionTable />;
    };
  }, [authContext.sessiontableState]);

  return (
    <div className="main-body">
      <Fallfowardpage showWisdom={true} />
      <form
        // className=" signin-container"
        onSubmit={(evt) => {
          evt.preventDefault();
          submitDate();
        }}
      >
        <label htmlFor="name">
          <SVGIcon className="icon" iconName="calendar" />
        </label>
        <DatePicker
          className="datepicker"
          selected={selecteddate}
          onChange={(e) => setSelecteddate(e)}
          dateFormat="yyyyMMdd"
          isClearable
        />
        <div className="buttonList">
          {/* <span className="errorMSG">{this.props.errorMSG}</span> */}
          <ul className="buttons">
            <li>
              <input
                type="submit"
                value="Go"
                className="primary signinbutton"
              />
            </li>
            <li>
              <Link to="/signinandsignup" className="minor">
                &#10229; Go back
              </Link>
            </li>
          </ul>
        </div>
      </form>
      <SessionTable history={authContext.sessiontableState} />
    </div>
  );
};
export default DatePick;
