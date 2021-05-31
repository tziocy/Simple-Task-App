import React from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import * as pages from "../pages";

export default [
  {
    path: "/",
    title: "home",
    icon: <HomeOutlined />,
    component: pages.HomePage,
  },
  {
    path: "/users",
    title: "users",
    icon: <UserOutlined />,
    component: pages.UsersPage,
  },
];
