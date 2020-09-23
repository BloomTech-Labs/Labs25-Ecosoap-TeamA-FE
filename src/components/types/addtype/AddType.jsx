// DEPENDENCY IMPORTS
import React from 'react';
import { inspect } from 'util';
import gql from 'graphql-tag';
// GRAPHQL IMPORTS
import { client } from '../../../index.js';
import { FETCH_TYPES } from '../../../graphql/queries.js';
// STYLING IMPORTS
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const AddTypeForm = props => {
  // DESTRUCTURE PROPS
  const { handleOk, types, setTypes, setTypeId } = props;

  // FORM ON FINISH - REQUIRED NAMING FOR ANT-DESIGN
  async function onFinish(values) {
    // THIS ALLOWS US TO DYNAMICALLY SUBMIT THE NUMBER OF FIELDS
    let fieldsValues = values.fields
      ? inspect(values.fields)
          .split("'")
          .join('"')
      : '[]';
    let CREATE_TYPE_MUTATION = gql`
        mutation {
            createType(input: {name: "${values.name}", fields: ${fieldsValues}, icon: "${values.icon}"}){
            type{
                id,
                name,
                fields{
                name,
                value
                }
                icon
            }
            }
        }
    `;
    await client
      .mutate({ mutation: CREATE_TYPE_MUTATION })
      .then(res => {
        setTypes([...types, res.data.createType.type]);
      })
      .catch(err => {
        console.log('CREATE_ERROR', err);
      });
    client
      .query({ query: FETCH_TYPES })
      .then(res => {
        setTypes([...res.data.types]);
        setTypeId(res.data.types[res.data.types.length - 1].id);
      })
      .catch(err => console.log(err));

    let current = document.getElementById('active');
    current.id = '';
    let buttons = document.getElementsByClassName('navBtn');
    buttons[buttons.length - 1].id = 'active';
    handleOk();
  }
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
          rules={[{ required: true, message: 'Name for type is required' }]}
        >
          <Input style={{ width: 350 }} placeholder="Name" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Icon" className="label">
        <Form.Item
          name="icon"
          noStyle
          rules={[{ required: true, message: 'Icon for type is required' }]}
        >
          <Input style={{ width: 350 }} placeholder="Icon Url" />
        </Form.Item>
      </Form.Item>

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
                    rules={[{ required: true, message: 'Field Name missing' }]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    fieldKey={[field.fieldKey, 'value']}
                    rules={[{ required: true, message: 'Field Value missing' }]}
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

export default AddTypeForm;
