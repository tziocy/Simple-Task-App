import * as types from "./types";
import { languages } from "../../config";

export const sendNotification = (payload) => ({
  type: types.SEND_NOTIFICATION,
  payload,
});

export const changeLanguage = (languageId) => ({
  type: types.CHANGE_SYSTEM_LANGUAGE,
  payload: languages.find((l) => l.id === languageId),
});

export const redirect = (url) => ({
  type: types.REDIRECT,
  payload: url,
});
