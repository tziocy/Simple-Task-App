import React from "react";
import { Dropdown, Menu } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { languages } from "../../config";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { changeLanguage, updateCurrentUser } from "../../redux/actions";

export default () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state) => state.system.language,
    shallowEqual
  );

  const onChangeLanguage = ({ key: language }) => {
    dispatch(changeLanguage(language));
    dispatch(updateCurrentUser({ language }));
  };

  const menu = () => {
    const MenuItems = languages.map((l) => (
      <Menu.Item key={l.id}>{l.label}</Menu.Item>
    ));
    return (
      <Menu selectedKeys={[selectedLanguage.id]} onClick={onChangeLanguage}>
        {MenuItems}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={menu()}>
      <button id="languagesDropdownButton" className="ant-dropdown-link">
        <GlobalOutlined />
        <span id="languagesDropdownText"> {selectedLanguage.label}</span>
      </button>
    </Dropdown>
  );
};
