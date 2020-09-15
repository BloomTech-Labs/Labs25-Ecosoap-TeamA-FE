// DEPENDENCY IMPORTS
import React from "react";
import axios from "axios";
import { inspect } from "util";
// GRAPHQL IMPORTS
import gql from "graphql-tag";
import { client } from "../../../index.js"
// STYLING IMPORTS
import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const AddRecordForm = (props) => {
  const { handleOk, types, typeId, setRecordsState} = props;
  const geocodekey = process.env.REACT_APP_GEO_CODE_KEY || "9TOkbmQ67wZSoNXOUgPZ0DsQg1hPFHsH";
  async function onFinish(values) {
    let city = values.address.city || "";
    let country = values.address.country || "";
    let state = values.address.state || "";
    let postal = values.address.postal || "";
    let street = values.address.street || "";
    let address = await axios.get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${geocodekey}&inFormat=kvp&outFormat=json&location=${street}%2C+${city}%2C+${state}+${postal}+${country}&thumbMaps=false`
    );
    let fieldValues = values.fields ? inspect(values.fields).split("'").join('"') : "[]";
      console.log(fieldValues)
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
    await client
      .mutate({ mutation: NEW_RECORD_MUT })
      .then(console.log)
      .catch(console.log);
    client.query({ query: RECORDS_QUERY })
      .then(res => { 
        setRecordsState(res)
      })
    handleOk()
  }
  console.log("in add record", props)
  return (
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
          rules={[{ required: true, message: "Name for record is required" }]}
        >
          <Input style={{ width: 350 }} placeholder="Name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Address" className="label">
        <Input.Group>
          <Form.Item
            name={["address", "street"]}
            noStyle
            rules={[{ required: true, message: "Street is Required" }]}
          >
            <Input style={{ width: 350 }} placeholder="Street" />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            noStyle
            rules={[{ required: true, message: "City is Required" }]}
          >
            <Input style={{ width: 350 }} placeholder="City" />
          </Form.Item>
          <Form.Item
            name={["address", "state"]}
            noStyle
            rules={[{ required: true, message: "State/Province Required" }]}
          >
            <Input style={{ width: 350 }} placeholder="State/Province" />
          </Form.Item>
          <Form.Item
            name={["address", "postal"]}
            noStyle
            rules={[{ required: false, message: "Postal Code Required" }]}
          >
            <Input style={{ width: 350 }} placeholder="Postal Code" />
          </Form.Item>
          <Form.Item
            name={["address", "country"]}
            noStyle
            rules={[{ required: false, message: "Country Required" }]}
          >
            <Input style={{ width: 350 }} placeholder="Country" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.List name="fields" >
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field) => (
                <Space key={field.key} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    fieldKey={[field.fieldKey, "name"]}
                    rules={[{ required: true, message: "Field Name missing" }]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "value"]}
                    fieldKey={[field.fieldKey, "value"]}
                    rules={[{ required: true, message: "Field Value missing" }]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}
              <Button
                className="dashedbtn"
                width="350"
                type="dashed"
                block
                onClick={() => {
                  add();
                }}
              >
                <PlusOutlined /> Add Fields
              </Button>
            </div>
          );
        }}
      </Form.List>
      <Button width="100%" size="large" type="primary" block htmlType="submit">
        Save
      </Button>
    </Form>
  );
};
export default AddRecordForm;