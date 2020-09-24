import React, { useState } from 'react';
import { Modal, List, Button, Popover, Form, Input } from 'antd';
import { client } from '../../index.js';
import gql from 'graphql-tag';
import { FETCH_USERS } from '../../graphql/queries.js';
import AddUserForm from './AddUserForm';

function UsersModal(props) {
  const { state, setState, users, setUsers } = props;
  const [addUState, setAddUState] = useState({
    visible: false,
    loading: false,
  });
  const showAddUser = () => {
    setAddUState({
      ...addUState,
      visible: !addUState.visible,
    });
  };
  const handleOk = () => {
    setState({ ...state, loading: !state.loading });
    setTimeout(() => {
      setState({ ...state, loading: !state.loading, visible: !state.visible });
    }, 500);
  };
  const handleCancel = () => {
    setState({ ...state, visible: false });
  };
  const delUser = async user => {
    const DEL_USER = gql`
          mutation {
            deleteUser(input: { email: "${user}" }) {
              success
            }
          }
        `;
    await client.mutate({ mutation: DEL_USER }).catch(console.log);
    client
      .query({ query: FETCH_USERS })
      .then(res => setUsers(res.data.users))
      .catch(console.log);
  };

  const updateUser = async user => {
    const UPDATE_USER = gql`
        mutation{
            updateUserProfile(input: {userId: "${user.id}", email: "${user.email}", password: "${user.password}"}){
                user{
                    id
                    email
                    password
                }
            }
        }
        `;
    await client
      .mutate({ mutation: UPDATE_USER })
      .then(console.log)
      .catch(console.log);
    client
      .query({ query: FETCH_USERS })
      .then(res => setUsers(res.data.users))
      .catch(console.log);
  };
  return (
    <div className="usersModal">
      <Modal
        width="50%"
        style={{ display: 'flex', flexDirection: 'column' }}
        visible={state.visible}
        title="Registered Admin Users"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <Button
            width="100%"
            size="large"
            type="primary"
            block
            htmlType="submit"
            onClick={handleOk}
          >
            Ok
          </Button>
        }
      >
        <List
          bordered
          dataSource={users}
          renderItem={item => (
            <List.Item
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              User Email: {item.email}{' '}
              <div className="buttonsforuser">
                <Popover
                  key={item.email + item.email}
                  content={
                    <Form
                      size="small"
                      name="edituser"
                      layout="vertical"
                      onFinish={values => {
                        let user = {
                          id: item.id,
                          email: values.email,
                          password: values.password
                            ? values.password
                            : item.password,
                        };
                        updateUser(user);
                      }}
                    >
                      <Form.Item label="Email">
                        <Form.Item
                          name="email"
                          initialValue={item.email}
                          rules={[
                            { required: true, message: 'Email Required' },
                          ]}
                        >
                          <Input style={{ width: 250 }} placeholder="Email" />
                        </Form.Item>
                      </Form.Item>
                      <Form.Item label="Password">
                        <Form.Item
                          name="password"
                          rules={[
                            { required: false, message: 'Password Required' },
                          ]}
                        >
                          <Input
                            style={{ width: 250 }}
                            placeholder="Password"
                          />
                        </Form.Item>
                      </Form.Item>
                      <Button block htmlType="submit">
                        Submit
                      </Button>
                    </Form>
                  }
                  title="Edit User Profile"
                  trigger="click"
                >
                  <i
                    key={item.id + item.email}
                    style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                    className="far fa-edit"
                  ></i>
                </Popover>
                <Popover
                  key={item.id}
                  content={
                    <a
                      onClick={() => {
                        delUser(item.email);
                      }}
                    >
                      yes
                    </a>
                  }
                  title="Are you sure?"
                  trigger="click"
                >
                  <i
                    key={item.email}
                    style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                    className="far fa-trash-alt"
                  ></i>
                </Popover>
              </div>
            </List.Item>
          )}
        ></List>
        <Button block onClick={showAddUser}>
          Add User
        </Button>
        {addUState.visible && (
          <AddUserForm
            state={addUState}
            setState={setAddUState}
            users={users}
            setUsers={setUsers}
          />
        )}
      </Modal>
    </div>
  );
}

export default UsersModal;
