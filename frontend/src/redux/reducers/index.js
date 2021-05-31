import { combineReducers } from "redux";
import * as types from "../actions/types";
import auth from "./auth";
import config from "./config";
import system from "./system";
import task from "./task";

const appReducer = combineReducers({
  ...auth,
  ...config,
  ...system,
  ...task,
});

export default (state, action) => {
  if (action.type === types.RESET) {
    state = undefined;
  }
  return appReducer(state, action);
};
