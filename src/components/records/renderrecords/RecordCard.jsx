import React, { useState } from 'react';
import { client } from '../../../index.js';
import gql from 'graphql-tag';

import EditModal from '../editrecord/EditRecordModal.jsx';

import { Popover } from 'antd';

const RecordCard = props => {
  // const {record, emstate, typeId, setEMState, setRecordsState} = props;
  const { record, typeId, setRecordsState, tableState, setTableState } = props;

  // eit modal state for visibility
  const [emstate, setEMState] = useState({ visible: false, loading: false });

  function showEMButton() {
    setEMState({ ...emstate, visible: !emstate.visible });
  }

  async function delRec(id) {
    let DEL_REC = gql`
        mutation {
          deleteRecord(input: { id: "${id}" }) {
            success
            error
          }
        }
      `;
    await client.mutate({ mutation: DEL_REC }).then(console.log);
    client.query({ query: RECORDS_QUERY }).then(res => {
      setRecordsState(res);
      setTableState(!tableState);
    });
  }
  // query to get all records by typeid
  let RECORDS_QUERY = gql`
        {
          recordsByType(input: { typeId: "${typeId}" }) {
            id
            name
            type {
              id
              name
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

  return (
    <div key={record.id}>
      <i
        key={record.name + record.id}
        style={{ cursor: 'pointer' }}
        className="far fa-edit"
        onClick={() => {
          showEMButton();
        }}
      ></i>

      <Popover
        key={record.id}
        content={
          <a
            onClick={() => {
              delRec(record.id);
            }}
          >
            yes
          </a>
        }
        title="Are you sure?"
        trigger="click"
      >
        <i
          key={record.name}
          style={{ cursor: 'pointer' }}
          className="far fa-trash-alt"
        ></i>
      </Popover>
      {emstate.visible && (
        <>
          <EditModal
            typeId={typeId}
            record={record}
            state={emstate}
            setState={setEMState}
            setRecordsState={setRecordsState}
            tableState={tableState}
            setTableState={setTableState}
          />
        </>
      )}
    </div>
  );
};

export default RecordCard;
