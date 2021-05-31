import * as types from "../actions/types";
import _ from 'lodash';

const tasks = (state = { data: [] }, action) => {
    switch (action.type) {
        case types.FETCH_TASKS:
            return {
                ...state,
                data: action.payload,
            };
        case types.CREATE_TASK: {
            return {
                ...state,
                data: [...state.data, ...[action.payload]],
            }
        }
        case types.UPDATE_TASK: {
            return {
                ...state,
                data: state.data.map(task => task._id === action.payload._id ? action.payload : task),
            }
        }
        case types.DELETE_TASK: {
            return {
                ...state,
                data: state.data.filter(task => task._id !== action.payload._id),
            }
        }
        default: {
            return state;
        }
    }
};

export default {
    tasks,
};
