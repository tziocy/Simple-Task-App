import * as types from "../actions/types";

const auth = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN: {
      return {
        ...action.payload.user,
        token: action.payload.token,
      };
    }
    case types.SET_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }
    case types.FETCH_ME: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case types.UPDATE_CURRENT_USER: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case types.LOGOUT: {
      return {
        ...state,
        token: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default {
  auth,
};
