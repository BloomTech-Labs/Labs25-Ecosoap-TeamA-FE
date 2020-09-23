// DEPENDENCY IMPORTS
import React from 'react';
import { inspect } from 'util';
// GRAPHQL IMPORTS
import gql from 'graphql-tag';
import { client } from '../../../index.js';
// STYLING IMPORTS
import { Form, Input, Button, Space, List, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TypeFieldsCard from '../../fields/TypeFieldsCard.js';

const EditTypeForm = props => {
  const {
    handleOk,
    type,
    setType,
    types,
    setTypes,
    tableState,
    setTableState,
    recordsState,
    setRecordsState,
  } = props;

  async function onFinish(values) {
    let fixedFields = type.fields.map(field => {
      delete field.__typename;
      return field;
    });

    let typeFields = values.fields
      ? type.fields || values.fields
        ? inspect([...fixedFields, ...values.fields])
            .split("'")
            .join('"')
        : '[]'
      : type.fields || values.fields
      ? inspect([...fixedFields])
          .split("'")
          .join('"')
      : '[]';
    let UPD_TYPE_MUTATION = gql`
        mutation {
            updateType(input: {id: "${type.id}" name: "${values.name}", icon: "${values.icon}", fields: ${typeFields}}){
            type{
                id,
                name,
                icon,
                fields{
                name,
                value
                }
            }
            }
        }
    `;

    await client
      .mutate({ mutation: UPD_TYPE_MUTATION })
      .then(async res => {
        setTypes(
          types.map(type =>
            type.id === res.data.updateType.type.id
              ? res.data.updateType.type
              : type
          )
        );

        let batchArray = [];

        let counter = 0;

        if (recordsState.data.recordsByType.length > 0) {
          recordsState &&
            (await recordsState.data.recordsByType.map(async record => {
              let fixedRecordFields = await record.fields.map(field => {
                delete field.id;
                delete field.__typename;
                return field;
              });

              let recordFields = values.fields
                ? fixedRecordFields
                  ? inspect([...fixedRecordFields, ...values.fields])
                      .split("'")
                      .join('"')
                  : '[]'
                : fixedRecordFields || values.fields
                ? inspect([...fixedRecordFields])
                    .split("'")
                    .join('"')
                : '[]';

              let BATCH_QUERY = `mutation${counter}: updateRecord(
              input: {
                id: "${record.id}"
                name: "${record.name}"
                coordinates: { latitude: ${record.coordinates.latitude}, longitude: ${record.coordinates.longitude} }
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
            }`;
              batchArray.push(BATCH_QUERY);
              counter += 1;
            }));

          let gqlString = `mutation {${batchArray}}`;

          let batchMutation = gql`
            ${gqlString}
          `;

          await client
            .mutate({
              mutation: batchMutation,
            })
            .catch(err => {
              console.log('ERROR: ', err);
            });
        }
        setTableState(!tableState);
      })
      .catch(err => {
        console.log('CREATE_ERROR', err);
      });
    var target = document.getElementsByClassName(`${type.id}`)[0];
    target.id = 'active';
    handleOk();
  }
  return (
    <div>
      {type.name && (
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
              initialValue={type.name}
              rules={[{ required: true, message: 'Name for type is required' }]}
            >
              <Input style={{ width: 350 }} placeholder="Name" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Icon" className="label">
            <Form.Item
              name="icon"
              noStyle
              initialValue={type.icon}
              rules={[{ required: true, message: 'Icon for type is required' }]}
            >
              <Input style={{ width: 350 }} placeholder="Icon Url" />
            </Form.Item>
          </Form.Item>
          <Divider orientation="left">Fields</Divider>
          <List
            bordered
            dataSource={type.fields}
            renderItem={item => (
              <List.Item>
                <TypeFieldsCard
                  key={Math.random()}
                  field={item}
                  type={type}
                  types={types}
                  setType={setType}
                  setTypes={setTypes}
                  recordsState={recordsState}
                  setRecordsState={setRecordsState}
                  tableState={tableState}
                  setTableState={setTableState}
                />
              </List.Item>
            )}
          />
          <Form.List name="fields">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map(field => (
                    <Space key={field.key} align="start">
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[
                          { required: true, message: 'Field Name missing' },
                          ({ getFieldValue }) => ({
                            validator(rule, value, callback) {
                              let fieldValTypes = types.filter(
                                typ => typ.id === type.id
                              )[0].fields;

                              fieldValTypes.map(field => {
                                if (field.name === value) {
                                  callback(
                                    'There is already a field with that name!'
                                  );
                                }
                                callback();
                              });
                            },
                          }),
                        ]}
                      >
                        <Input placeholder="Name" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[
                          { required: true, message: 'Field Value missing' },
                        ]}
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

export default EditTypeForm;
