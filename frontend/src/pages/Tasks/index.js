import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import {
  Button,
  Form,
  Input,
  Modal,
  PageHeader,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import {
  createTask,
  fetchTasks,
  deleteTask,
  updateTask,
} from "../../redux/actions";
import _ from "lodash";

const Tasks = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const tasks = useSelector((state) => state.tasks.data, shallowEqual);
  console.log(tasks);

  const requiredRule = {
    required: true,
    message: intl.formatMessage({ id: "required" }),
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
      title: intl.formatMessage({ id: "owner" }),
      dataIndex: "owner",
      render: (record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: intl.formatMessage({ id: "title" }),
      dataIndex: "title",
    },
    {
      title: intl.formatMessage({ id: "description" }),
      dataIndex: "description",
    },
    {
      title: intl.formatMessage({ id: "completed" }),
      render: (record) => record.completed ? "Yes" : "No"
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    return dispatch(fetchTasks()).finally(() => setLoading(false));
  };

  const onDelete = (id) => {
    setLoading(true);
    dispatch(deleteTask(id)).finally(() => setLoading(false));
  };

  const onClickEdit = (data) => () => {
    modalForm.setFieldsValue(data);
    setTaskModalVisible(true);
  };

  const onOkTasksModal = async () => {
    try {
      await modalForm.validateFields();
      const values = modalForm.getFieldsValue();
      setSubmitting(true);
      if (isEdit()) {
        await dispatch(updateTask(values));
      } else {
        await dispatch(createTask(values));
      }
      setSubmitting(false);
      onCancelUsersModal();
    } catch {
      setSubmitting(false);
    }
  };

  const onCancelUsersModal = () => {
    modalForm.resetFields();
    setTaskModalVisible(false);
  };


  const isEdit = () => !_.isEmpty(modalForm.getFieldValue("_id"));

  return (
    <div>
      <Modal
        title={
          isEdit()
            ? intl.formatMessage({ id: "editTask" })
            : intl.formatMessage({ id: "newTask" })
        }
        visible={taskModalVisible}
        onOk={onOkTasksModal}
        okButtonProps={{ disabled: submitting }}
        onCancel={onCancelUsersModal}
        cancelButtonProps={{ disabled: submitting }}
      >
        <Form name="taskForm" form={modalForm} layout="vertical">
          <Form.Item name="_id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "title" })}
            name="title"
            rules={[requiredRule]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "description" })}
            name="description"
            rules={[requiredRule]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: "completed" })}
            name="completed"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ width: "100%" }}>
        <PageHeader
          className="site-page-header-ghost-wrapper"
          ghost={false}
          title={intl.formatMessage({ id: "tasks" })}
          extra={<Button type="primary" onClick={() => setTaskModalVisible(true)}>{intl.formatMessage({ id: "newTask" })}</Button>}
        />
        <Table
          bordered={true}
          columns={columns}
          dataSource={tasks}
          pagination={false}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1300 }}
          size="small"
        />
      </div>
    </div>
  );
};

export default Tasks;