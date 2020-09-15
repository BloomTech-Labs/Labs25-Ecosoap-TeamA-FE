// DEPENDENCY IMPORTS
import React, { useState, useEffect } from 'react';
// GRAPHQL IMPORTS
import { client } from '../../../index.js';
import gql from 'graphql-tag';
// COMPONENT IMPORTS
import CRModal from '../addrecord/CRModal.jsx';
import RecordCard from './RecordCard.jsx';
// STYLING IMPORTS
import { Button, Table } from 'antd';

function RenderRecords(props) {
  const { typeId } = props;
  let [dataSource, setDataSource] = useState([]);
  let [columns, setColumns] = useState([]);

  let [recordsState, setRecordsState] = useState(null);
  // create modal state for visibility
  const [crmstate, setCRMState] = useState({ visible: false, loading: false });
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
              id
            }
          }
        }
      `;
  useEffect(() => {
    client
      .query({ query: RECORDS_QUERY })
      .then(res => {
        setRecordsState(res);
        // Setting DataSource for Table
        let data = [];
        res.data.recordsByType.map(record => {
          let dataObject = {};
          dataObject.name = record.name;
          record.fields.map(field => {
            dataObject[field.name] = field.value;
            dataObject.key = field.id;
          });
          data.push(dataObject);
        });
        setDataSource(data);
        //Setting Field Columns on Table
        let fieldColumns = [];
        let typeFields = props.types.filter(type => type.id === typeId);
        typeFields[0].fields.map(field =>
          fieldColumns.push({
            title: field.name,
            dataIndex: field.name,
            key: field.name,
          })
        );

        setColumns([
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          ...fieldColumns,
        ]);
      })
      .catch(err => console.log('ERROR', err));
  }, [typeId]);

  return (
    <>
      {dataSource && <Table dataSource={dataSource} columns={columns} />}
      {/* {recordsState &&
        recordsState.data.recordsByType.map(record => {
          return (
            <RecordCard
              key={record.id}
              record={record}
              typeId={typeId}
              setRecordsState={setRecordsState}
            />
          );
        })} */}
      <Button
        size="large"
        onClick={() => {
          showCRMButton();
        }}
      >
        Add Record{' '}
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
