import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import EditRecordForm from './EditRecord.jsx';
import { client } from '../../../index';
import gql from 'graphql-tag';
import axios from 'axios';

function EditModal(props) {
  const geocodekey =
    process.env.REACT_APP_GEO_CODE_KEY;
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    post: '',
    country: '',
  });
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
  function getTypeToPass() {
    let QUERY_REC_ID = gql`
        {
            recordById(input:{recordId: "${props.record.id}"}){
                id
                name
                type{
                  id
                  name
                  fields {
                    name
                    value
                  }
                  }
                coordinates {
                      latitude
                      longitude
                }
                fields {
                    name
                    value
                }
            }
        }
        `;
    client.query({ query: QUERY_REC_ID }).then(res => {
      setTimeout(() => {
        axios
          .get(
            `https://www.mapquestapi.com/geocoding/v1/reverse?key=${geocodekey}&location=${res.data.recordById.coordinates.latitude}%2C${res.data.recordById.coordinates.longitude}&outFormat=json&thumbMaps=false`
          )
          .then(res => {
            setAddress({
              ...address,
              street: res.data.results[0].locations[0].street,
              city: res.data.results[0].locations[0].adminArea5,
              state: res.data.results[0].locations[0].adminArea3,
              post: res.data.results[0].locations[0].postalCode,
              country: res.data.results[0].locations[0].adminArea1,
            });
          })
          .catch(err => console.log(err));
      });
    }, 500);
  }

  useEffect(() => {
    getTypeToPass();
  }, []);
  return (
    <div className="modal">
      <Modal
        width="400px"
        style={{ display: 'flex', flexDirection: 'column' }}
        visible={props.state.visible}
        title="Edit Record"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <EditRecordForm
          typeId={props.typeId}
          handleOk={handleOk}
          loading={props.state.loading}
          visible={props.state.visible}
          type={props.titleText}
          record={props.record}
          address={address}
          setRecordsState={props.setRecordsState}
          tableState={props.tableState}
          setTableState={props.setTableState}
          types={props.types}
        />
      </Modal>
    </div>
  );
}

export default EditModal;
