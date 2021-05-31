import * as types from "../actions/types";

const config = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_PUBLIC_CONFIG:
    case types.FETCH_CONFIG:
    case types.UPDATE_CONFIG: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default {
  config,
};
