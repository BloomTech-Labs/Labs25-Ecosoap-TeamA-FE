import React from 'react';
import { Form, Button, Input, Modal } from 'antd';
import gql from 'graphql-tag';
import { client } from '../../index.js';
import { FETCH_USERS } from '../../graphql/queries';

function AddUserForm(props) {
  const { state, setState, users, setUsers } = props;

  const handleOk = () => {
    setState({ ...state, loading: !state.loading });
    setTimeout(() => {
      setState({
        ...state,
        loading: !state.loading,
        visible: !state.visible,
      });
    }, 500);
  };
  const handleCancel = () => {
    setState({ ...state, visible: false });
  };
  const onFinish = async values => {
    const ADD_USER = gql`
        mutation{
            register(input: {email: "${values.email}", password: "${values.password}"}){
                success
            }
        }
        `;
    await client.mutate({ mutation: ADD_USER }).catch(console.log);
    client
      .query({ query: FETCH_USERS })
      .then(res => setUsers(res.data.users))
      .catch(console.log);
    handleOk();
  };
  return (
    <Modal
      width="30%"
      style={{ display: 'flex', flexDirection: 'column' }}
      visible={state.visible}
      title="Add User"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form size="small" name="edituser" layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email Required' },
              ({ getFieldValue }) => ({
                validator(rule, value, callback) {
                  users.map(user => {
                    if (user.email === value) {
                      callback('Email already in use!');
                    }
                    callback();
                  });
                },
              }),
            ]}
          >
            <Input style={{ width: 350 }} placeholder="Email" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Password">
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="Password" />
          </Form.Item>
        </Form.Item>
        <Button block htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
}

export default AddUserForm;
