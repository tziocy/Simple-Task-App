import React from "react";
import { Button, Result } from "antd";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

const ForbiddenPage = () => {
  const intl = useIntl();
  const history = useHistory();
  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle={intl.formatMessage({ id: "notAllowedPage" })}
        extra={
          <Button onClick={() => history.push("/")} type="primary">
            {intl.formatMessage({ id: "backHome" })}
          </Button>
        }
      />
    </div>
  );
};

export default ForbiddenPage;
