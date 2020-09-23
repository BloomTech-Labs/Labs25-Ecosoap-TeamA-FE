import React from 'react';
import { Form, Input, Button, List, Divider } from 'antd';
import axios from 'axios';
import gql from 'graphql-tag';
import { client } from '../../../index.js';
import { inspect } from 'util';
import RecordFieldsCard from '../../fields/RecordFieldsCard.js';

const EditRecordForm = props => {
  const {
    handleOk,
    typeId,
    setRecordsState,
    record,
    address,
    tableState,
    setTableState,
  } = props;

  const geocodekey =
    process.env.REACT_APP_GEO_CODE_KEY || '9TOkbmQ67wZSoNXOUgPZ0DsQg1hPFHsH';
  async function onFinish(values) {
    let city = values.address.city || '';
    let country = values.address.country || '';
    let state = values.address.state || '';
    let postal = values.address.postal || '';
    let street = values.address.street || '';
    let address = await axios.get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${geocodekey}&inFormat=kvp&outFormat=json&location=${street}%2C+${city}%2C+${state}+${postal}+${country}&thumbMaps=false`
    );

    let fixedFields = record.fields.map(field => {
      delete field.__typename;
      delete field.id;
      return field;
    });

    let recordFields = values.fields
      ? record.fields || values.fields
        ? inspect([...fixedFields, ...values.fields])
            .split("'")
            .join('"')
        : '[]'
      : record.fields || values.fields
      ? inspect([...fixedFields])
          .split("'")
          .join('"')
      : '[]';

    let UPD_RECORD_MUT = gql`
      mutation {
        updateRecord(
          input: {
            id: "${record.id}"
            name: "${values.name}"
            coordinates: { latitude: ${address.data.results[0].locations[0].latLng.lat}, longitude: ${address.data.results[0].locations[0].latLng.lng} }
            fields: ${recordFields} 
          }
        ) {
          record {
            id
            name
            coordinates {
              latitude
              longitude
            }
            fields {
              id
              name
              value
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
    fields {
      id
      name
      value
             }
        }
        coordinates {
          latitude
          longitude
        }
        fields {
          id
          name
          value
        }
      }
    }
  `;
    await client.mutate({ mutation: UPD_RECORD_MUT }).catch(console.log);
    client.query({ query: RECORDS_QUERY }).then(res => {
      setRecordsState(res);
      setTableState(!tableState);
    });
    handleOk();
  }

  return (
    <div>
      {address.country && (
        <Form
          size="medium"
          name="addrecordform"
          layout="vertical"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="Name" className="label">
            <Form.Item
              name="name"
              noStyle
              initialValue={record.name}
              rules={[
                { required: true, message: 'Name for record is required' },
              ]}
            >
              <Input style={{ width: 350 }} placeholder="Name" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Address" className="label">
            <Input.Group>
              <Form.Item
                name={['address', 'street']}
                noStyle
                initialValue={`${address.street}`}
                rules={[{ required: false, message: 'Street is Recommended' }]}
              >
                <Input style={{ width: 350 }} placeholder="Street" />
              </Form.Item>
              <Form.Item
                name={['address', 'city']}
                noStyle
                initialValue={address.city}
                rules={[{ required: false, message: 'City is Recommended' }]}
              >
                <Input style={{ width: 350 }} placeholder="City" />
              </Form.Item>
              <Form.Item
                name={['address', 'state']}
                noStyle
                initialValue={address.state}
                rules={[
                  { required: false, message: 'State/Province Recommended' },
                ]}
              >
                <Input style={{ width: 350 }} placeholder="State/Province" />
              </Form.Item>
              <Form.Item
                name={['address', 'postal']}
                noStyle
                initialValue={address.post}
                rules={[
                  { required: false, message: 'Postal Code Recommended' },
                ]}
              >
                <Input style={{ width: 350 }} placeholder="Postal Code" />
              </Form.Item>
              <Form.Item
                name={['address', 'country']}
                noStyle
                initialValue={address.country}
                rules={[{ required: false, message: 'Country Recommended' }]}
              >
                <Input style={{ width: 350 }} placeholder="Country" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Divider orientation="left">Fields</Divider>
          <List
            bordered
            dataSource={record.fields}
            renderItem={item => (
              <List.Item>
                <RecordFieldsCard
                  field={item}
                  key={Math.random()}
                  record={record}
                  tableState={tableState}
                  setTableState={setTableState}
                />
              </List.Item>
            )}
          />
          <Button
            width="100%"
            size="large"
            type="primary"
            block
            htmlType="submit"
          >
            Save
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditRecordForm;
