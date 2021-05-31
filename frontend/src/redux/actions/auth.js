import * as types from "./types";

export const login = (username, password) => {
  return (api) => ({
    type: types.LOGIN,
    payload: api.post("v1/public/login", { username, password }).then((res) => {
      window.localStorage.setItem("token", res.data.token);
      return res;
    }),
  });
};

export const register = (body) => {
  return (api) => ({
    type: types.REGISTER,
    payload: api.post("v1/public/register", body),
  });
};

export const initialiseToken = () => {
  const token = window.localStorage.getItem("token");
  return {
    type: types.SET_TOKEN,
    payload: token,
  };
};

export const fetchMe = () => {
  return (api) => ({
    type: types.FETCH_ME,
    payload: api.get("v1/user/me"),
  });
};

export const logout = () => {
  window.localStorage.removeItem("token");
  return {
    type: types.LOGOUT,
  };
};

export const reset = () => {
  return {
    type: types.RESET,
  };
};
