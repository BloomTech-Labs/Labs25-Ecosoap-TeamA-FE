import React, { useState } from 'react';
import { client } from "../../../index.js";
import gql from "graphql-tag";

import CRModal from "../addrecord/CRModal.jsx"
import EditModal from "../editrecord/EditRecordModal.jsx"

import { Button, Popover } from "antd";

const RecordCard = (props) => {
    // const {record, emstate, typeId, setEMState, setRecordsState} = props;
    const { record, typeId, setRecordsState } = props;

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
        await client.mutate({ mutation: DEL_REC }).then(console.log)
        client.query({ query: RECORDS_QUERY }).then(res => setRecordsState(res))
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
            <h1>{record.name}</h1>
            {record.fields.map(field => {
                return (
                    <div key={field.name}>{field.name}, {field.value}</div>
                )
            })}
            {/* <i key={record.name+record.id}
                className="far fa-edit"
                onClick={() => {
                  showEMButton();
                }}
              ></i> */}
            <button key={record.name + record.id}
                className="far fa-edit"
                onClick={() => {
                    showEMButton();
                }}
            ></button>

            <Popover
                key={record.id}
                content={<a onClick={() => { delRec(record.id) }}>yes</a>}
                title="Are you sure?"
                trigger="click"
            >
                {/* <i key={record.name} className="far fa-trash-alt"></i> */}
                <button key={record.name} />
            </Popover>
            {emstate.visible && (
                <>

                    <EditModal
                        typeId={typeId}
                        record={record}
                        state={emstate}
                        setState={setEMState}
                        setRecordsState={setRecordsState}
                    />
                </>
            )}
        </div>
    )
}

export default RecordCard;