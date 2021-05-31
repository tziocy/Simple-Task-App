import * as types from "./types";

export const createUser = (body) => {
  return (api) => ({
    type: types.CREATE_USER,
    payload: api.post("v1/user", body),
    showUserErrors: true,
    success: {
      message: "createUser",
      description: "createUserSuccess",
    },
  });
};

export const deleteUser = (id) => {
  return (api) => ({
    type: types.DELETE_USER,
    payload: api.delete(`v1/user/${id}`),
    success: {
      message: "deleteUser",
      description: "deleteUserSuccess",
    },
  });
};

export const updateCurrentUser = (body) => {
  return (api) => ({
    type: types.UPDATE_CURRENT_USER,
    payload: api.put("v1/user", body),
    showUserErrors: true,
    success: {
      message: "updateUser",
      description: "updateUserSuccess",
    },
  });
};

export const updateUser = (body) => {
  return (api) => ({
    type: types.UPDATE_USER,
    payload: api.put(`v1/user`, body),
    showUserErrors: true,
    success: {
      message: "updateUser",
      description: "updateUserSuccess",
    },
  });
};

export const fetchUsers = (page, size, filters) => {
  return (api) => ({
    type: types.FETCH_USERS,
    payload: api.post(`v1/user/search`, { page, size, filters }),
  });
};
