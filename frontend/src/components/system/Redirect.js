import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "../../redux/actions";
import { useHistory } from "react-router-dom";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const redirectUrl = useSelector((state) => state.system.redirect);

  useEffect(() => {
    if (redirectUrl) {
      history.push(redirectUrl);
      dispatch(redirect(null));
    }
  }, [redirectUrl, dispatch, history]);

  return <></>;
};
