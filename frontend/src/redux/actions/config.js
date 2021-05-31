import * as types from "./types";

export const fetchConfig = () => {
  return (api) => ({
    type: types.FETCH_CONFIG,
    payload: api.get("v1/config"),
  });
};

export const fetchPublicConfig = () => {
  return (api) => ({
    type: types.FETCH_PUBLIC_CONFIG,
    payload: api.get("v1/public/config"),
  });
};

export const updateConfig = (values = {}) => {
  return (api) => ({
    type: types.UPDATE_CONFIG,
    payload: api.put("v1/config", values),
    success: {
      message: "updateConfig",
      description: "updateSuccess",
    },
  });
};
