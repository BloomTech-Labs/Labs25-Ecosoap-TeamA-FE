import React from 'react';
import { Form, Input } from 'antd';

const AddRecordFieldsCard = props => {
  const { field } = props;
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
