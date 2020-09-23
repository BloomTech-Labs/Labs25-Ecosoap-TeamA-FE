import React, { useState } from 'react';

import { Form, Input, Button, Space, List, Divider } from 'antd';
import { SingleFieldSubscriptionsRule } from 'graphql';

const AddRecordFieldsCard = props => {
  const { typeFields, setFields, field, fields } = props;
  //   const [disabled, setDisabled] = useState(false);
  //   const onFinish = async values => {
  //     let fieldsObj = { name: field.name, value: values.value };
  //     console.log(fieldsObj);
  //     setDisabled(!disabled);
  //     await setFields([...fields, fieldsObj]);
  //   };
  return (
    <div>
      <Form.Item label={field.name} style={{ width: '100%' }} className="label">
        <Form.Item
          name={field.name}
          noStyle
          initialValue={field.value}
          rules={[{ required: true, message: 'Value for type is required' }]}
        >
          <Input style={{ width: 300 }} placeholder="None" />
        </Form.Item>
      </Form.Item>
    </div>
  );
};

export default AddRecordFieldsCard;
