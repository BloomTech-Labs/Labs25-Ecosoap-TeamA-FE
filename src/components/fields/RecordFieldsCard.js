import React, { useState } from 'react';
import { Popover, Form, Input, Button } from 'antd';
function RecordFieldsCard(props) {
  function onFinish(values) {
    let updatedField = { name: props.field.name, value: values.value };
    console.log('Form Values', updatedField);
  }
  function delField(id) {
    console.log('You really gonna delete me', id);
  }
  return (
    <div className="fieldsCard">
      <span>Name: {props.field.name}</span> &nbsp;&nbsp;
      <span>Value: {props.field.value}</span>
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
                  <Input style={{ width: 350 }} placeholder="Value" />
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
      &nbsp;&nbsp;
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
  );
}

export default RecordFieldsCard;
