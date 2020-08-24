import React, { useState } from "react";
import { Modal, Button } from 'antd';
import AddRecordForm from "../addrecord/AddRecord";




function CRModal(props){

    const handleOk = () => {
        props.setState({ ...props.state, loading: !props.state.loading })
        setTimeout(() => {
            props.setState({ ...props.state, loading: !props.state.loading, visible: !props.state.visible })
        }, 1500)
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
                    title={props.titleText}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <AddRecordForm
                        handleOk={handleOk}
                        loading={props.state.loading}
                        visible={props.state.visible}
                        type={props.titleText}
                    />
                </Modal>
            </div>
        );
    }


export default CRModal;