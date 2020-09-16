// DEPENDENCY IMPORTS
import React, { useState, useEffect } from 'react';
// GRAPHQL IMPORTS
import { client } from '../../../index.js';
import gql from 'graphql-tag';
// COMPONENT IMPORTS
import CRModal from '../addrecord/CRModal.jsx';
import RecordCard from './RecordCard.jsx';
// STYLING IMPORTS
import { Button, Table, Space } from 'antd';

function RenderRecords(props) {
  const { typeId, tableState, setTableState } = props;
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
        // console.log('RECORD RESPONSE', res);
        setRecordsState(res);
        // Setting DataSource for Table
        console.log('Setting up table!!!');
        let data = [];
        res.data.recordsByType.map(record => {
          let dataObject = {};
          dataObject.name = record.name;
          dataObject.id = record.id;
          dataObject.coordinates = {
            latitude: record.coordinates.latitude,
            longitude: record.coordinates.longitude,
          };
          dataObject.typeId = record.type.id;
          record.fields.map(field => {
            dataObject[field.name] = field.value;
            dataObject.key = record.id;
            return null;
          });
          data.push(dataObject);
          return null;
        });
        setDataSource(data);
        //Setting Field Columns on Table
        let fieldColumns = [];
        let typeFields = props.types.filter(type => type.id === typeId);
        typeFields[0].fields.map(field => {
          fieldColumns.push({
            title: field.name,
            dataIndex: field.name,
            key: field.name,
          });
          return null;
        });

        setColumns([
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          ...fieldColumns,
          {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: record => (
              <Space size="middle">
                {/* <a>Delete</a>
                <a>Edit</a> */}
                {/* {// recordsState.data.records.map()
                console.log('record', record)} */}
                {/* {console.log(typeId)} */}
                <RecordCard
                  key={record.id}
                  record={record}
                  typeId={typeId}
                  setRecordsState={setRecordsState}
                  tableState={tableState}
                  setTableState={setTableState}
                />
              </Space>
            ),
          },
        ]);
      })
      .catch(err => console.log('ERROR', err));
  }, [typeId, tableState]);

  return (
    <>
      {dataSource && (
        <Table
          key={Math.random()}
          dataSource={dataSource}
          columns={columns}
          bordered={true}
          pagination={{ position: ['bottomCenter'] }}
        />
      )}
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
          tableState={tableState}
          setTableState={setTableState}
        />
      )}
    </>
  );
}
export default RenderRecords;
