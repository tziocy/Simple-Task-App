import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { sendNotification } from "../../redux/actions";
import { useIntl } from "react-intl";
import _ from "lodash";

export default (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const notificationObj = useSelector(
    (state) => state.system.notification,
    shallowEqual
  );
  useEffect(() => {
    if (notificationObj) {
      const { type, message, description } = notificationObj;
      notification[type]({
        message: intl.formatMessage({ id: message }),
        description: (
          <div>
            {_.castArray(description).map((msg) => (
              <div key={msg}>{intl.formatMessage({ id: msg })}</div>
            ))}
          </div>
        ),
      });
      dispatch(sendNotification(null));
    }
  }, [notificationObj, dispatch, intl]);
  return <></>;
};
