import * as types from "../actions/types";
import { languages } from "../../config";

const initialLanguage = languages.find((l) => l.default);

const system = (
  state = { notification: null, redirect: null, language: initialLanguage },
  action
) => {
  switch (action.type) {
    case types.SEND_NOTIFICATION: {
      return { ...state, notification: action.payload };
    }
    case types.CHANGE_SYSTEM_LANGUAGE: {
      return { ...state, language: action.payload };
    }
    case types.REDIRECT: {
      return { ...state, redirect: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default { system };
