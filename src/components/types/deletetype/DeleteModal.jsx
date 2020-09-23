// DEPENDENCY IMPORTS
import React, { useState } from 'react';
// GRAPHQL IMPORTS
import gql from 'graphql-tag';
import { client } from '../../../index.js';
import { FETCH_TYPES } from '../../../graphql/queries.js';
// STYLING IMPORTS
import { Modal, Button, Form, Input } from 'antd';

function DeleteModal(props) {
  const handleOk = () => {
    props.setState({ ...props.state, loading: !props.state.loading });

    setTimeout(() => {
      props.setState({
        ...props.state,
        visible: !props.state.visible,
        loading: !props.state.loading,
      });
    }, 500);
  };
  async function onFinish() {
    let DEL_TYPE = gql`
      mutation {
        deleteType(
          input: { id: "${props.typeId}" }
        ) {
          success
          error
        }
      }
    `;
    await client.mutate({ mutation: DEL_TYPE });
    client.query({ query: FETCH_TYPES }).then(res => {
      props.setTypes(res.data.types);
      props.setTypeId(res.data.types[0].id);
    });
    let current = document.getElementById('active');
    current.id = '';
    document.getElementsByClassName('navBtn')[1].id = 'active';
    handleOk();
  }
  const handleCancel = () => {
    props.setState({ ...props.state, visible: false });
  };
  const [toDelete, setToDelete] = useState({ value: '' });
  const validateIt = value => {
    if (value === props.title) {
      document.getElementById('delete-button').removeAttribute('disabled');
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    } else {
      document.getElementById('delete-button').setAttribute('disabled', true);
      return {
        validateStatus: 'error',
        errorMsg: 'Type Validation Failed',
      };
    }
  };
  const changeHandler = e => {
    setToDelete({
      ...toDelete,
      ...validateIt(e.target.value),
      value: e.target.value,
    });
  };
  const tips =
    'Please type in the name of the Type that you would like to delete';
  return (
    <div className="modal">
      <Modal
        width="400px"
        style={{ display: 'flex', flexDirection: 'column' }}
        visible={props.state.visible}
        title="Delete Record"
        onCancel={handleCancel}
        footer={null}
      >
        <h1 style={{ color: 'red', fontWeight: 'bolder' }}>WARNING:</h1>
        <h3>
          All Records, Fields, and Media will be deleted along with this type.
          All data will be lost.
        </h3>
        <h3>Are you sure you wish to proceed?</h3>
        <Form onFinish={onFinish}>
          <Form.Item
            label="Please type the name of the Type you wish to delete"
            validateStatus={toDelete.validateStatus}
            help={toDelete.errorMsg || tips}
          >
            <Input
              type="text"
              value={toDelete.value}
              onChange={e => {
                changeHandler(e);
              }}
            />
          </Form.Item>
          <Button
            width="100%"
            size="large"
            type="primary"
            block
            htmlType="submit"
            id="delete-button"
            disabled={true}
          >
            Delete
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default DeleteModal;
