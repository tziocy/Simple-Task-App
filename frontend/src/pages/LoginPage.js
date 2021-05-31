import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Spin } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import _ from "lodash";

import { fetchPublicConfig, login } from "../redux/actions";

export default () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);

  const auth = useSelector((state) => state.auth, shallowEqual);
  const config = useSelector((state) => state.config, shallowEqual);

  useEffect(() => {
    dispatch(fetchPublicConfig()).finally(() => setConfigLoading(false));
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    dispatch(login(values.username, values.password))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (!_.isNil(auth.token)) {
    return <Redirect to={_.get(location, "state.from", "/")} />;
  }

  if (configLoading) {
    return (
      <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        size="large"
      />
    );
  }

  return (
    <Row id="loginPageWrapper" type="flex" justify="center" align="middle">
      <Col>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ marginBottom: 32 }}
        >
          <img id="logo" src={_.get(config, "logo")} alt="Logo" />
        </Row>
        <Card id="login-card" bordered={false}>
          <Row type="flex" justify="center" align="middle">
            <span id="loginText">Login</span>
          </Row>
          {error ? (
            <Alert
              id="loginError"
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "10px" }}
            />
          ) : null}
          <Row>
            <Col>
              <Form
                onFinish={onFinish}
                className="login-form"
                layout="vertical"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Row>
                  <Col span={24}>
                    <Button
                      block
                      id="loginButton"
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      disabled={loading}
                    >
                      Log in
                    </Button>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col>
                    <span>
                      By logging in, you agree to our terms and conditions.
                    </span>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
