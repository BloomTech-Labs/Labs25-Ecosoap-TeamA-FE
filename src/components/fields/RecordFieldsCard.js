// DEPENDENCY IMPORTS
import React from 'react';
import gql from 'graphql-tag';
import { inspect } from 'util';
// GRAPHQL IMPORTS
import { client } from '../../index';
// STYLING IMPORTS
import { Popover, Form, Input, Button } from 'antd';

function RecordFieldsCard(props) {
  // ONFINISH IS WHAT EXECUTES WHEN YOU SUBMIT THE FORM
  // THIS IS AN ANT-DESIGN STANDARD NAMING
  async function onFinish(values) {
    // YOU HAVE TO INSPECT THE FIELDS SO THAT YOU CAN SEND THE MUTATION TO
    // GRAPHQL WITHOUT ERROR, WITHOUT INSPECT IT RECEIVES "[object Object]"
    // BECAUSE GRAPHQL REQUIRES A STRING, AND DOES NOT ACCEPT JSON DATA
    let updatedFields = inspect(
      props.record.fields.map(field => {
        // DELETE _typename BECAUSE OF GRAPHQL ERROR ON SERVER SIDE
        delete field.__typename;
        // DELETE ID BECAUSE WERE QUERYING FOR IT
        delete field.id;
        return field.name === props.field.name
          ? { name: props.field.name, value: values.value }
          : field;
      })
    )
      .split("'")
      .join('"');
    // UPDATE RECORD MUTATION
    let UPD_RECORD_MUT = gql`
      mutation {
        updateRecord(
          input: {
            id: "${props.record.id}"
            name: "${props.record.name}"
            coordinates: { latitude: ${props.record.coordinates.latitude}, longitude: ${props.record.coordinates.longitude} }
            fields: ${updatedFields}
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
    // AWAIT THE UPDATE MUTATION AND SET THE INFORMATION IN THE TABLE TO THE
    // UPDATED RESPONSE
    await client
      .mutate({ mutation: UPD_RECORD_MUT })
      .then(res => {
        props.setTableState(!props.tableState);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
  // DELETE FIELD FUNCTION ONLY RESETS THE FIELD VALUE ON A RECORD TO "None"
  function delField(id) {
    let fixedFields = props.record.fields.map(field => {
      delete field.__typename;
      delete field.id;
      return field;
    });
    let updatedFields = inspect(
      fixedFields.map(field => {
        return field.name === props.field.name
          ? { ...field, value: 'None' }
          : field;
      })
    )
      .split("'")
      .join('"');
    let DELETE_Field_MUT = gql`
      mutation {
        updateRecord(
          input: {
            id: "${props.record.id}"
            name: "${props.record.name}"
            coordinates: { latitude: ${props.record.coordinates.latitude}, longitude: ${props.record.coordinates.longitude} }
            fields: ${updatedFields}
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
    client
      .mutate({ mutation: DELETE_Field_MUT })
      .then(res => {
        props.setTableState(!props.tableState);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
  return (
    <div className="fieldsCard">
      <div className="line1">
        <span>Name: {props.field.name}</span>
        <Popover
          key={props.field.id}
          content={
            <>
              <Form
                size="medium"
                name="editfield"
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item label="Value" className="label">
                  <Form.Item
                    name="value"
                    noStyle
                    initialValue={props.field.value}
                    rules={[
                      { required: true, messsage: 'Value for field required' },
                    ]}
                  >
                    <Input style={{ width: 300 }} placeholder="Value" />
                  </Form.Item>
                </Form.Item>
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
            </>
          }
          title="Edit Field"
          trigger="click"
        >
          <i
            key={props.field.name}
            style={{ cursor: 'pointer' }}
            className="far fa-edit"
          ></i>
        </Popover>
      </div>
      <div className="line2">
        <span>Value: {props.field.value}</span>
        <Popover
          key={Math.random()}
          content={
            <a
              onClick={() => {
                delField(props.field.id);
              }}
            >
              {' '}
              yes{' '}
            </a>
          }
          title="Are you sure?"
          trigger="click"
        >
          <i
            key={props.field.name + props.field.id}
            style={{ cursor: 'pointer' }}
            className="far fa-trash-alt"
          ></i>
        </Popover>
      </div>
    </div>
  );
}

export default RecordFieldsCard;
