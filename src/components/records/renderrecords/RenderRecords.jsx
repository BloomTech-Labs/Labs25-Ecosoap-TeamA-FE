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
  const {
    types,
    typeId,
    tableState,
    setTableState,
    recordsState,
    setRecordsState,
  } = props;
  let [dataSource, setDataSource] = useState([]);
  let [columns, setColumns] = useState([]);
  let [typeName, setTypeName] = useState('');

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
          dataObject.id = record.id;
          dataObject.coordinates = {
            latitude: record.coordinates.latitude,
            longitude: record.coordinates.longitude,
          };
          dataObject.typeId = record.type.id;
          dataObject.fields = record.fields;
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
        setTypeName(typeFields[0].name);
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
            render: record => (
              <Space size="middle">
                <RecordCard
                  key={record.id}
                  record={record}
                  typeId={typeId}
                  setRecordsState={setRecordsState}
                  tableState={tableState}
                  setTableState={setTableState}
                  types={types}
                />
              </Space>
            ),
          },
        ]);
      })
      .catch(err => console.log('ERROR', err));
  }, [typeId, tableState]);

  return (
    <div className="recordsParent">
      <div className="recordsHeader">
        <h1>{typeName}</h1>
        <Button
          size="large"
          onClick={() => {
            showCRMButton();
          }}
        >
          Add Record{' '}
        </Button>
      </div>
      <div className="recordsTable">
        {dataSource && (
          <Table
            rowKey={row => row.id}
            dataSource={dataSource}
            columns={columns}
            bordered={false}
            pagination={{ position: ['bottomCenter'], pageSize: 12 }}
          />
        )}
      </div>

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
    </div>
  );
}
export default RenderRecords;
