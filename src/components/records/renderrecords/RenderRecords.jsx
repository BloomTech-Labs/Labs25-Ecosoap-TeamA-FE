// DEPENDENCY IMPORTS
import React, { useState, useEffect } from "react";
// GRAPHQL IMPORTS
import { client } from "../../../index.js";
import gql from "graphql-tag";
// COMPONENT IMPORTS
import CRModal from "../addrecord/CRModal.jsx"
import EditModal from "../editrecord/EditRecordModal.jsx"
// STYLING IMPORTS
import { Button, Popover } from "antd";

function RenderRecords(props) {
  const { typeId } = props;


  let [recordsState, setRecordsState] = useState(null);
  // create modal state for visibility
  const [crmstate, setCRMState] = useState({ visible: false, loading: false })
  function showCRMButton() {
    setCRMState({ ...crmstate, visible: !crmstate.visible });
  }
  // eit modal state for visibility
  const [emstate, setEMState] = useState({ visible: false, loading: false });
  function showEMButton() {
    setEMState({ ...emstate, visible: !emstate.visible });
  }
  async function delRec(id){
    let DEL_REC = gql`
    mutation {
      deleteRecord(input: { id: "${id}" }) {
        success
        error
      }
    }
  `;
    await client.mutate({ mutation: DEL_REC }).then(console.log)
    client.query({query: RECORDS_QUERY}).then(res => setRecordsState(res))
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
  useEffect(() => {
    client
      .query({ query: RECORDS_QUERY })
      .then((res) => {
        console.log("RECORDS RESPONSE", res);
        setRecordsState(res);
      })
      .catch((err) => console.log("ERROR", err));
  }, [typeId]);
  return (
    <>
      {recordsState &&
        recordsState.data.recordsByType.map((record) => {
          return (
            <div key={record.id}>
              <h1>{record.name}</h1>
              {record.fields.map(field => {
                return (
                  <div key={field.name}>{field.name}, {field.value}</div>
                )
              })}
              <i key={record.name+record.id}
                className="far fa-edit"
                onClick={() => {
                  showEMButton();
                }}
              ></i>
              
              <Popover
              key={record.id}
                content={<a onClick={() => { delRec(record.id)}}>yes</a>}
                title="Are you sure?"
                trigger="click"
              >
                <i key={record.name} className="far fa-trash-alt"></i>
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
          );
        })}
      <Button
        size="large"
        onClick={() => {
          showCRMButton();
        }}
      >
        Add Record{" "}
      </Button>
      ;
      {crmstate.visible && (
        <CRModal
          types={props.types}
          type={props.typeId}
          recordsState={recordsState}
          setRecordsState={setRecordsState}
          state={crmstate}
          setState={setCRMState}
        />
      )}

    </>
  );
}
export default RenderRecords;
