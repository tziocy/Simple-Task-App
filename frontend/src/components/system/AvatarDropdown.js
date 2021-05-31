import React from "react";
import { useIntl } from "react-intl";
import { Avatar, Dropdown, Menu } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { UserOutlined } from "@ant-design/icons";

import { logout } from "../../redux/actions";

export default () => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth, shallowEqual);

  const onClickLogout = () => {
    dispatch(logout());
    history.push("/login");
  };

  const menu = () => (
    <Menu>
      <Menu.Item key="logout" onClick={onClickLogout}>
        {intl.formatMessage({ id: "logout" })}
      </Menu.Item>
    </Menu>
  );

  const renderAvatar = (user) => (
    <Avatar
      className="userAvatarDropdown"
      src={_.get(user, "photo.small")}
      icon={<UserOutlined />}
    >
      {user.firstName && user.firstName.charAt(0).toUpperCase()}
    </Avatar>
  );

  return (
    <Dropdown overlay={menu(dispatch, intl)}>
      <button className="ant-dropdown-link userAvatarDropdownButton">
        {renderAvatar(user)}
        <span className="userAvatarDropdownText">{user.firstName}</span>
      </button>
    </Dropdown>
  );
};
