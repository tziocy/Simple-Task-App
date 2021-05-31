import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/actions";
import _ from "lodash";

const { Option } = Select;

const Users = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState({
    data: [],
    total: 0,
    pageSize: 10,
    current: 1,
    filters: {},
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  const { data, filters, ...pagination } = usersData;

  const requiredRule = {
    required: true,
    message: intl.formatMessage({ id: "required" }),
  };

  const emailRule = {
    type: "email",
    message: intl.formatMessage({ id: "invalid" }),
  };

  const columns = [
    {
      title: intl.formatMessage({ id: "actions" }),
      width: 180,
      render: (data) => (
        <div>
          <Button onClick={onClickEdit(data)} type="link">
            {intl.formatMessage({ id: "edit" })}
          </Button>
          <Popconfirm
            placement="top"
            title={intl.formatMessage({
              id: "areYouSureYouWantToDeleteThis?",
            })}
            onConfirm={() => onDelete(data._id)}
            okText={intl.formatMessage({ id: "yes" })}
            cancelText={intl.formatMessage({ id: "no" })}
          >
            <Button type="link">{intl.formatMessage({ id: "delete" })}</Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: "username" }),
      dataIndex: "username",
    },
    {
      title: intl.formatMessage({ id: "firstName" }),
      dataIndex: "firstName",
    },
    {
      title: intl.formatMessage({ id: "lastName" }),
      dataIndex: "lastName",
    },
    {
      title: intl.formatMessage({ id: "email" }),
      dataIndex: "email",
    },
    {
      title: intl.formatMessage({ id: "phone" }),
      dataIndex: "phone",
    },
    {
      title: intl.formatMessage({ id: "language" }),
      render: (record) =>
        record.language === "el"
          ? intl.formatMessage({ id: "greek" })
          : intl.formatMessage({ id: "english" }),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (current = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    return dispatch(fetchUsers(current, pageSize, filters)).then(
      ({ payload }) => {
        setUsersData(payload);
        setLoading(false);
      }
    );
  };

  const onDelete = (id) => {
    setLoading(true);
    dispatch(deleteUser(id))
      .then(() =>
        loadData(
          data.length === 1
            ? Math.max(pagination.current - 1, 1)
            : pagination.current,
          pagination.pageSize,
          filters
        )
      )
      .finally(() => setLoading(false));
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    loadData(current, pageSize, filters);
  };

  const onClickEdit = (data) => () => {
    modalForm.setFieldsValue(data);
    setUserModalVisible(true);
  };

  const onOkUsersModal = async () => {
    try {
      await modalForm.validateFields();
      const values = modalForm.getFieldsValue();
      setSubmitting(true);
      if (isEdit()) {
        await dispatch(updateUser(values));
      } else {
        await dispatch(createUser(values));
      }
      setSubmitting(false);
      onCancelUsersModal();
      resetSearch();
    } catch {
      setSubmitting(false);
    }
  };

  const onCancelUsersModal = () => {
    modalForm.resetFields();
    setUserModalVisible(false);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    loadData();
  };

  const submitSearch = () => {
    const values = _.omitBy(searchForm.getFieldsValue(), _.isNil);
    if (!_.isEmpty(values)) {
      loadData(1, 10, values);
    }
  };

  const isEdit = () => !_.isEmpty(modalForm.getFieldValue("_id"));

  return (
    <div>
      <Modal
        title={
          isEdit()
            ? intl.formatMessage({ id: "editUser" })
            : intl.formatMessage({ id: "newUser" })
        }
        visible={userModalVisible}
        onOk={onOkUsersModal}
        okButtonProps={{ disabled: submitting }}
        onCancel={onCancelUsersModal}
        cancelButtonProps={{ disabled: submitting }}
      >
        <Form name="userForm" form={modalForm} layout="vertical">
          <Form.Item name="_id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "username" })}
            name="username"
            rules={[requiredRule]}
          >
            <Input disabled={isEdit()} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "password" })}
            name="password"
            rules={isEdit() ? [] : [requiredRule]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "firstName" })}
            name="firstName"
            rules={[requiredRule]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "lastName" })}
            name="lastName"
            rules={[requiredRule]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "email" })}
            name="email"
            rules={[emailRule]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: "phone" })} name="phone">
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "language" })}
            name="language"
            rules={[requiredRule]}
          >
            <Select>
              <Option value="el">Greek</Option>
              <Option value="en">English</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ width: "100%" }}>
        <PageHeader
          className="site-page-header-ghost-wrapper"
          ghost={false}
          title={intl.formatMessage({ id: "Users" })}
        />
        <Form form={searchForm} layout="vertical">
          <Row gutter={16}>
            <Col>
              <Form.Item
                label={intl.formatMessage({ id: "username" })}
                name="username"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={intl.formatMessage({ id: "firstName" })}
                name="firstName"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={intl.formatMessage({ id: "lastName" })}
                name="lastName"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={intl.formatMessage({ id: "email" })}
                name="email"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={intl.formatMessage({ id: "phone" })}
                name="phone"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Form.Item label=" ">
                <Button onClick={submitSearch} type="primary" className="mr-8">
                  {intl.formatMessage({ id: "query" })}
                </Button>
                <Button onClick={resetSearch} className="mr-8">
                  {intl.formatMessage({ id: "reset" })}
                </Button>
                <Button
                  type="primary"
                  className="mr-8"
                  onClick={() => setUserModalVisible(true)}
                >
                  {intl.formatMessage({ id: "new" })}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table
          onChange={handleTableChange}
          bordered={true}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1300 }}
          size="small"
        />
      </div>
    </div>
  );
};

export default Users;