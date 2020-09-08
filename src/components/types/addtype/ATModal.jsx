// DEPENDENCY IMPORTS
import React from "react";
// COMPONENT IMPORTS
import AddTypeForm from "./AddType.jsx";
// STYLING IMPORTS
import { Modal } from 'antd';

function ATModal(props){

    const handleOk = () => {
        props.setState({ ...props.state, loading: !props.state.loading })
        setTimeout(() => {
            props.setState({ ...props.state, loading: !props.state.loading, visible: !props.state.visible })
        }, 500)
    }
    const handleCancel = () => {
        props.setState({ ...props.state, visible: false })
    }
        return (
            <div className="modal">
                <Modal
                    width="400px"
                    style={{ display: "flex", flexDirection: 'column'}}
                    visible={props.state.visible}
                    title="Add Type"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <AddTypeForm
                        handleOk={handleOk}
                        loading={props.state.loading}
                        visible={props.state.visible}
                        type={props.titleText}
                        types={props.types}
                        setTypes={props.setTypes}
                        setTypeId={props.setTypeId}
                    />
                </Modal>
            </div>
        );
    }


export default ATModal;