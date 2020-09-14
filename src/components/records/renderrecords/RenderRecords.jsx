// DEPENDENCY IMPORTS
import React, { useState, useEffect } from "react";
// GRAPHQL IMPORTS
import { client } from "../../../index.js";
import gql from "graphql-tag";
// COMPONENT IMPORTS
import CRModal from "../addrecord/CRModal.jsx"
import EditModal from "../editrecord/EditRecordModal.jsx"
import RecordCard from "./RecordCard.jsx";
// STYLING IMPORTS
import { Button, Popover, Table } from "antd";

function RenderRecords(props) {
  const { typeId } = props;
  let [dataSource, setDataSource] = useState([]);
  let [columns, setColumns] = useState([]);

  let [recordsState, setRecordsState] = useState(null);
  // create modal state for visibility
  const [crmstate, setCRMState] = useState({ visible: false, loading: false })
  function showCRMButton() {
    setCRMState({ ...crmstate, visible: !crmstate.visible });
  }
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
        setDataSource(res.data.recordsByType);
        let fieldColumns = [];
        let something = props.types.filter(type => type.id === typeId);
        something[0].fields.map(field => fieldColumns.push({ title: field.name, dataIndex: "name", key: "name" }))

        setColumns([
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          ...fieldColumns
        ])
        console.log("TYPES", props.types)
      })
      .catch((err) => console.log("ERROR", err));
  }, [typeId]);

  console.log("recordsState", recordsState)

  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     key: 'name',
  //   },
  //   {
  //     title: 'ID',
  //     dataIndex: 'id',
  //     key: 'id',
  //   },
  // ];

  console.log("dataSource", dataSource)
  // console.log("Columns", columns)

  return (
    <>
      {
        dataSource && <Table dataSource={dataSource} columns={columns} />
      }
      {recordsState &&
        recordsState.data.recordsByType.map((record) => {
          return (
            <RecordCard key={record.id} record={record} typeId={typeId} setRecordsState={setRecordsState} />
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
