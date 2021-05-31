import React, { useEffect, useState } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { changeLanguage, fetchConfig, fetchMe } from "../../redux/actions";

const RequiresAuth = ({ path, children }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth, shallowEqual);
  const config = useSelector((state) => state.config, shallowEqual);
  const [isReady, setIsReady] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (_.isNil(auth.token)) {
      return history.push({
        pathname: "/login",
        state: { from: location.pathname },
      });
    } else if (_.isNil(auth._id) || _.isNil(config)) {
      if (!fetching) {
        setFetching(true);
        Promise.all([
          dispatch(fetchConfig()),
          dispatch(fetchMe()).then((data) => {
            dispatch(changeLanguage(data.payload.language))
          }),
        ]).then(() => setFetching(false));
      }
    } else {
      setIsReady(true);
    }
  }, [history, location, dispatch, auth, config]);

  if (!isReady) {
    return (
      <div style={{ position: "fixed", top: "50%", left: "50%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return <Route path={path} render={() => children} />;
};

export default RequiresAuth;