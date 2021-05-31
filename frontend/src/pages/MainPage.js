import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  NavLink,
  Route,
  withRouter,
  Switch,
  useLocation,
} from "react-router-dom";
import { Col, ConfigProvider, Layout, Menu, Row, Spin } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import moment from "moment";
import { FormattedMessage, IntlProvider } from "react-intl";
import _ from "lodash";

import Notification from "../components/system/Notification";
import RedirectComponent from "../components/system/Redirect";
import AvatarDropdown from "../components/system/AvatarDropdown";
import LanguagesDropdown from "../components/system/LanguagesDropdown";

//  Import moment Languages
import "moment/locale/en-gb";
import "moment/locale/el";

import * as appConfig from "../config";
import RequiresAuth from "../components/system/RequiresAuth";
import * as Pages from "./";
import { fetchPublicConfig } from "../redux/actions";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Item = ({ to, children, exact = false, ...props }) => (
  <Menu.Item {...props}>
    <NavLink
      className="nav-text"
      activeClassName="active"
      to={to}
      exact={exact}
    >
      {children}
    </NavLink>
  </Menu.Item>
);

const renderMenuItemChildren = ({ icon, title }) => (
  <React.Fragment>
    {icon}
    <span>
      <FormattedMessage id={title} />
    </span>
  </React.Fragment>
);

const renderMenuItem = (item) => {
  return item.submenu ? (
    <SubMenu key={item.path} title={renderMenuItemChildren(item)}>
      {item.submenu.map(renderMenuItem)}
    </SubMenu>
  ) : (
    <Item key={item.path} to={item.path} exact={item.exact}>
      {item.children ? item.children : renderMenuItemChildren(item)}
    </Item>
  );
};

const MainPage = (props) => {
  //  Main Menu Location and collapse status
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [loadingPublicConfig, setLoadingPublicConfig] = useState(true);
  const { config } = props;
  const root = "/" + location.pathname.split("/")[1];

  //  Locale Info
  const [locale, setLocale] = useState(props.language.antd);
  const [intlLocaleId, setintlLocaleId] = useState(props.language.id);

  useEffect(() => {
    setLocale(props.language.antd);
    moment.locale(props.language.moment);
    setintlLocaleId(props.language.id);
  }, [props.language]);

  useEffect(() => {
    if (_.isNil(props.config)) {
      props.fetchPublicConfig().then(() => setLoadingPublicConfig(false));
    } else {
      setLoadingPublicConfig(false);
    }
  }, []);

  const intlLocale = appConfig.languages.find((l) => l.id === intlLocaleId);

  if (loadingPublicConfig) {
    return (
      <div style={{ position: "fixed", top: "50%", left: "50%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <IntlProvider
      locale={intlLocaleId}
      defaultLocale={intlLocaleId}
      key={intlLocaleId}
      messages={intlLocale.i18n}
    >
      <ConfigProvider locale={locale}>
        <Switch>
          <RequiresAuth path="/">
            <Layout id="mainPageLayout">
              <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo">
                  <img src={_.get(config, "logo")} />
                </div>
                <Menu
                  id="topMenu"
                  theme="dark"
                  mode="inline"
                  //  defaultSelectedKeys={[root]}
                  defaultOpenKeys={[root]}
                  selectedKeys={[location.pathname]}
                >
                  {appConfig.menuItems.map(renderMenuItem)}
                </Menu>
              </Sider>
              <Layout>
                <Header id="topHeader">
                  <Row>
                    <Col span={18}>
                      {collapsed ? (
                        <MenuUnfoldOutlined
                          className="headerMenu-IconBurger"
                          onClick={() => setCollapsed(!collapsed)}
                        />
                      ) : (
                        <MenuFoldOutlined
                          className="headerMenu-IconBurger"
                          onClick={() => setCollapsed(!collapsed)}
                        />
                      )}
                    </Col>
                    <Col span={6}>
                      <div id="topHeaderRightElements" className="right">
                        <AvatarDropdown />
                        <LanguagesDropdown />
                      </div>
                    </Col>
                  </Row>
                </Header>
                <Content id="mainPageContent">
                  <Switch>
                    <Route exact path="/page">
                      <Pages.MyPage />
                    </Route>
                    <Route path="/users">
                      <Pages.UsersPage />
                    </Route>
                    <Route path="/">
                      <Pages.HomePage />
                    </Route>
                  </Switch>
                </Content>
              </Layout>
            </Layout>
            <Notification />
            <RedirectComponent />
          </RequiresAuth>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.system.language,
    config: state.config,
  };
};

export default connect(mapStateToProps, { fetchPublicConfig })(
  withRouter(MainPage)
);
