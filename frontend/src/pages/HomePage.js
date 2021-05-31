import React from "react";
import { useIntl } from "react-intl";
import Tasks from './Tasks';

const Home = () => {
  const intl = useIntl();
  return (
    <>
      <h1>{intl.formatMessage({ id: "home" })}</h1>
      <Tasks />
    </>
  );
};

export default Home;