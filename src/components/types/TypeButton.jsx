import React, { useState } from 'react';

const TypeButton = (props) => {
    const { type } = props;

      // EDIT MODAL => STATE AND SHOW BUTTON FUNCTION
  const [emstate, setEMState] = useState({
    visible: false,
    loading: false,
  });
  function showEMButton() {
    setEMState({
      ...emstate,
      visible: !emstate.visible,
    });
  }
  // DELETE MODAL => STATE AND SHOW BUTTON FUNCTIONALITY
  const [dmstate, setDMState] = useState({
    visible: false,
    loading: false,
  });
  function showDMButton() {
    setDMState({
      ...dmstate,
      visible: !dmstate.visible,
    });
  }

    const content = (
        <div>
          <p
            className="popoverp"
            onClick={() => {
              showEMButton();
            }}
          >
            Edit
          </p>
          <p
            className="popoverp"
            style={{ color: 'red' }}
            onClick={() => {
              showDMButton();
            }}
          >
            Delete
          </p>
        </div>
    );

    return (
        <Popover
                key={type.name}
                placement="rightBottom"
                title="Options"
                content={content}
                trigger="hover"
              >
                <Button
                  key={type.id}
                  onClick={() => {
                    setTypeName(type.name);
                    settypeId(type.id);
                    props.setMapState(false);
                  }}
                >
                  {type.name}
                </Button>
              </Popover>
    )
}

export default TypeButton;