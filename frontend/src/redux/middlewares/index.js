import _ from "lodash";
import axios from "axios";
import { logout, redirect, sendNotification } from "../actions";

const getApi = (state) => {
  const makeRequest = (method) => (endpoint, body) => {
    const bodyNotEmpty = body !== undefined;
    const bodyContainsFormData = body instanceof FormData;
    const bodyObj = bodyNotEmpty ? { data: body } : {};
    const token = _.get(state, "auth.token");
    const authObj = token ? { Authorization: `Bearer ${token}` } : {};
    const contentTypeObj = bodyNotEmpty
      ? {
          "Content-Type": bodyContainsFormData
            ? "multipart/form-data"
            : "application/json",
        }
      : {};
    const finalUrl = `/api/${endpoint}`;
    return axios({
      method,
      url: finalUrl,
      ...bodyObj,
      headers: {
        Accept: "application/json",
        ...authObj,
        ...contentTypeObj,
      },
    });
  };
  return {
    get: makeRequest("GET"),
    post: makeRequest("POST"),
    put: makeRequest("PUT"),
    delete: makeRequest("DELETE"),
  };
};

export default ({ dispatch, getState }) => {
  return (next) => (action) => {
    if (!_.isFunction(action) && !_.get(action, "payload.then")) {
      return next(action);
    }

    const state = getState();

    const actionResult = action(getApi(state), state);

    return actionResult.payload.then(
      (response) => {
        actionResult.success &&
          dispatch(
            sendNotification({
              type: "success",
              message: actionResult.success.message,
              description: actionResult.success.description,
            })
          );
        return dispatch({ ...actionResult, payload: response.data });
      },
      (err) => {
        if (_.get(err, "response.status") === 401) {
          dispatch(logout());
          throw err;
        } else if (_.get(err, "response.status") === 403) {
          dispatch(redirect("/forbidden"));
        } else if (_.get(err, "response.status") < 500) {
          if (
            actionResult.showUserErrors &&
            _.get(err, "response.status") === 400
          ) {
            dispatch(
              sendNotification({
                type: "error",
                message: "validationError",
                description: _.get(err, "response.data.errors", []).map(
                  (error) => error.msg
                ),
              })
            );
          }
          throw { ...err.response.data, status: err.response.status };
        } else {
          dispatch(
            sendNotification({
              type: "error",
              message: "Something went wrong",
              description:
                "Oops. Something went wrong. Please try again later.",
            })
          );
          throw err;
        }
      }
    );
  };
};
