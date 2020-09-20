// DEPENDENCY IMPORTS
import React, { useState, useEffect } from 'react';
// GRAPHQL IMPORTS
import gql from 'graphql-tag';
import { client } from '../../../index.js';
// COMPONENT IMPORTS
import EditTypeForm from './EditType.jsx';
// STYLING IMPORTS
import { Modal } from 'antd';

function EditModal(props) {
  const [type, setType] = useState('');
  useEffect(() => {
    let GET_TYPE = gql`
    {
      typeById(input: {typeId: "${props.typeId}"}){
        id
        name
        icon
        fields {
          name
          value
        }
      }
    }
    `;
    client.query({ query: GET_TYPE }).then(res => setType(res.data.typeById));
  }, []);
  const handleOk = () => {
    props.setState({ ...props.state, loading: !props.state.loading });
    setTimeout(() => {
      props.setState({
        ...props.state,
        loading: !props.state.loading,
        visible: !props.state.visible,
      });
    }, 500);
  };
  const handleCancel = () => {
    props.setState({ ...props.state, visible: false });
  };

  return (
    <div className="modal">
      <Modal
        width="400px"
        style={{ display: 'flex', flexDirection: 'column' }}
        visible={props.state.visible}
        title="Edit Type"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <EditTypeForm
          handleOk={handleOk}
          loading={props.state.loading}
          visible={props.state.visible}
          type={type}
          setType={setType}
          setTypes={props.setTypes}
          types={props.types}
          tableState={props.tableState}
          setTableState={props.setTableState}
          recordsState={props.recordsState}
          setRecordsState={props.setRecordsState}
        />
      </Modal>
    </div>
  );
}

export default EditModal;
