import * as types from "./types";

export const createTask = (body) => {
  return (api) => ({
    type: types.CREATE_TASK,
    payload: api.post("v1/task", body),
    showTaskErrors: true,
    success: {
      message: "createTask",
      description: "createTaskSuccess",
    },
  });
};

export const deleteTask = (id) => {
  return (api) => ({
    type: types.DELETE_TASK,
    payload: api.delete(`v1/task/${id}`),
    success: {
      message: "deleteTask",
      description: "deleteTaskSuccess",
    },
  });
};

export const updateTask = (body) => {
  return (api) => ({
    type: types.UPDATE_TASK,
    payload: api.put(`v1/task/${body._id}`, body),
    showTaskErrors: true,
    success: {
      message: "updateTask",
      description: "updateTaskSuccess",
    },
  });
};

export const fetchTasks = () => {
  return (api) => ({
    type: types.FETCH_TASKS,
    payload: api.get(`v1/task`),
  });
};
