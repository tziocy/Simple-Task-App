import React from "react";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.less";

import rootReducer from "./redux/reducers";
import middleware from "./redux/middlewares";
import { initialiseToken } from "./redux/actions";
import * as Pages from "./pages";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(middleware))
);

store.dispatch(initialiseToken());

export default () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/login">
            <Pages.LoginPage />
          </Route>
          <Route>
            <Pages.MainPage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};
