// DEPENDENCY IMPORTS
import React, { useState } from 'react';
import axios from 'axios';
import { inspect } from 'util';
// GRAPHQL IMPORTS
import gql from 'graphql-tag';
import { client } from '../../../index.js';
// STYLING IMPORTS
import { Form, Input, Button, Divider, List } from 'antd';
import AddRecordFieldsCard from './AddRecordFieldsCard';

const AddRecordForm = props => {
  const {
    handleOk,
    typeId,
    tableState,
    setTableState,
    setRecordsState,
    types,
  } = props;
  const [fields, setFields] = useState([]);
  const typeFields = types.filter(type => type.id === typeId)[0].fields;
  const geocodekey =
    process.env.REACT_APP_GEO_CODE_KEY || '9TOkbmQ67wZSoNXOUgPZ0DsQg1hPFHsH';
  async function onFinish(values) {
    let valuesagain = Object.values(typeFields);

    let fieldsSomething = valuesagain.map(field => {
      return values.hasOwnProperty(`${field.name}`)
        ? { name: field.name, value: values[`${field.name}`] }
        : field;
    });
    let city = values.address.city || '';
    let country = values.address.country || '';
    let state = values.address.state || '';
    let postal = values.address.postal || '';
    let street = values.address.street || '';
    let address = await axios.get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${geocodekey}&inFormat=kvp&outFormat=json&location=${street}%2C+${city}%2C+${state}+${postal}+${country}&thumbMaps=false`
    );
    let fieldValues = fieldsSomething
      ? inspect(fieldsSomething)
          .split("'")
          .join('"')
      : '[]';
    let NEW_RECORD_MUT = gql`
      mutation {
        createRecord(
          input: {
            typeId: "${typeId}"
            name: "${values.name}"
            coordinates: { latitude: ${address.data.results[0].locations[0].latLng.lat}, longitude: ${address.data.results[0].locations[0].latLng.lng} }
            fields: ${fieldValues} 
          }
        ) {
          record {
            id
            name
            coordinates {
              latitude
              longitude
            }
          }
        }
      }
    `;
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
    await client.mutate({ mutation: NEW_RECORD_MUT }).catch(console.log);
    client.query({ query: RECORDS_QUERY }).then(res => {
      setRecordsState(res);
      setTableState(!tableState);
    });
    handleOk();
  }
  return (
    <Form
      size="medium"
      name="addrecordform"
      layout="vertical"
      onFinish={onFinish}
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item label="Name" className="label">
        <Form.Item
          name="name"
          noStyle
          rules={[{ required: true, message: 'Name for record is required' }]}
        >
          <Input style={{ width: 350 }} placeholder="Name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Address" className="label">
        <Input.Group>
          <Form.Item
            name={['address', 'street']}
            noStyle
            rules={[{ required: true, message: 'Street is Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="Street" />
          </Form.Item>
          <Form.Item
            name={['address', 'city']}
            noStyle
            rules={[{ required: true, message: 'City is Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="City" />
          </Form.Item>
          <Form.Item
            name={['address', 'state']}
            noStyle
            rules={[{ required: true, message: 'State/Province Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="State/Province" />
          </Form.Item>
          <Form.Item
            name={['address', 'postal']}
            noStyle
            rules={[{ required: false, message: 'Postal Code Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="Postal Code" />
          </Form.Item>
          <Form.Item
            name={['address', 'country']}
            noStyle
            rules={[{ required: false, message: 'Country Required' }]}
          >
            <Input style={{ width: 350 }} placeholder="Country" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Divider orientation="left">Fields</Divider>
      <List
        bordered
        dataSource={typeFields}
        renderItem={item => (
          <List.Item>
            <AddRecordFieldsCard
              field={item}
              key={Math.random()}
              tableState={tableState}
              setTableState={setTableState}
              typeFields={typeFields}
              setFields={setFields}
              fields={fields}
            />
          </List.Item>
        )}
      />
      <Button width="100%" size="large" type="primary" block htmlType="submit">
        Save
      </Button>
    </Form>
  );
};
export default AddRecordForm;
