// DEPENDENCY IMPORTS
import React from "react";
import { inspect } from "util";
// GRAPHQL IMPORTS
import gql from "graphql-tag";
import { client } from "../../../index.js";
// STYLING IMPORTS
import { Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";


const EditTypeForm = (props) => {
  const { handleOk, type, setTypes, types } = props;
  async function onFinish(values) {
    let fieldsValues = values.fields
      ? inspect(values.fields).split("'").join('"')
      : "[]";
    console.log(fieldsValues);
    let UPD_TYPE_MUTATION = gql`
        mutation {
            updateType(input: {id: "${type.id}" name: "${values.name}", fields: ${fieldsValues}}){
            type{
                id,
                name,
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
      .then((res) => {
        console.log("Update response", res );
        setTypes(types.map(type => type.id === res.data.updateType.type.id ? res.data.updateType.type : type))
      })
      .catch((err) => {
        console.log("CREATE_ERROR", err);
      });
    handleOk();
  }
  return (
    <div>
     {type.name && ( <Form
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
            rules={[{ required: true, message: "Name for type is required" }]}
          >
            <Input style={{ width: 350 }} placeholder="Name" />
          </Form.Item>
        </Form.Item>

        <Form.List name="fields">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space key={field.key} align="start">
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[
                        { required: true, message: "Field Name missing" },
                      ]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "value"]}
                      fieldKey={[field.fieldKey, "value"]}
                      rules={[
                        { required: true, message: "Field Value missing" },
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
      </Form>)}
    </div>
  );
};
      

export default EditTypeForm;
