import { GET_DAILYSESSION, GET_DAILYSESSION_ERROR } from "../actions/types";
const initialState = {
  // date: "",
  sessions: [],
  errorMSG: "",
};

export default function getSessionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DAILYSESSION:
      return { sessions: action.payload };
    case GET_DAILYSESSION_ERROR:
      return { errorMSG: action.payload };
    default:
      return state;
  }
}
