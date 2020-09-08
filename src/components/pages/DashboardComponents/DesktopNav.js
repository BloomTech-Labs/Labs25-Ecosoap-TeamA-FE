// DEPENDENCY IMPORTS
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// OKTA IMPORTS
import { useOktaAuth } from '@okta/okta-react';

// STYLING IMPORTS
import { Button, Popover } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

//GRAPHQL IMPORTS
import { client } from '../../../index.js';
import { FETCH_TYPES } from '../../../graphql/queries.js';

//COMPONENT IMPORTS
import ATModal from '../../types/addtype/ATModal.jsx';
import EditTypeModal from '../../types/edittype/EditTypeModal.jsx';
import DeleteModal from '../../types/deletetype/DeleteModal.jsx';
import RenderRecords from '../../records/renderrecords/RenderRecords.jsx';
// ASSET IMPORTS
import logo from '../../../assets/ecosoapbanklogopng.png';

// DESKTOP NAV COMPONENT
const DesktopNav = props => {
  // USED BELOW TO PUSH TO MAP WHEN MAP BUTTON IS CLICKED
  const { push } = useHistory();
  // OKTA AUTHORIZATION HOOK
  const { authService } = useOktaAuth();
  // TYPES STATE - MAP THROUGH THIS TO DYNAMICALLY DISPLAY TYPES
  const [types, setTypes] = useState([]);
  // ADD TYPE MODAL STATE AND FUNCTIONALITY
  const [atstate, setATState] = useState({
    visible: false,
    loading: false,
  });
  function showATModal() {
    setATState({
      ...atstate,
      visible: !atstate.visible,
    });
  }
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
  // STORE TYPE ID FOR USE WITH MODALS
  const [typeId, settypeId] = useState([]);
  const [typeName, setTypeName] = useState('');
  // GET ALL TYPES - THIS WILL ALLOW US TO MAP THROUGH THEM ALL TO CREATE DYNAMIC BUTTONS
  function getTypes() {
    client
      .query({ query: FETCH_TYPES })
      .then(res => {
        setTypes(res.data.types);
      })
      .catch(console.log);
  }
  // THIS IS INSIDE OF THE POPOVER WHEN YOU HOVER ON A TYPE
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

  // RUN THE GET TYPES FUNCTION EVERYTIME THE COMPONENT LOADS
  // ALSO RUNS WHEN YOU CLICK ON A NEW TYPE BUTTON
  useEffect(() => {
    getTypes();
  }, [types.length]);
  return (
    <nav className="desktopNav">
      <div className="desktopLogo">
        <img src={logo} alt="EcoSoapBank logo" />
      </div>
      <div className="dbButtons">
        <Button onClick={() => props.setMapState(true)}>Map</Button>
        {/* THIS DYNAMICALLY CREATES A BUTTON FOR EACH OF THE TYPES */}
        {types &&
          types.map(type => {
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
            );
          })}
        {/* BUTTON TO ADD A NEW TYPE */}
        <Button
          className="dashedbtn"
          width="350"
          type="dashed"
          onClick={() => {
            showATModal();
          }}
        >
          <PlusOutlined /> Add Type
        </Button>
      </div>
      <div className="adduser">
        <Button>Add User</Button>
      </div>
      <div className="adminSignOut">
        <Button type="link" onClick={() => authService.logout()}>
          Sign Out
        </Button>
      </div>
      {/* MODALS RENDERED WHEN THE VISIBLE STATE IS CHANGED TO TRUE */}
      {atstate.visible && (
        <ATModal
          types={types}
          setTypes={setTypes}
          setTypeId={settypeId}
          state={atstate}
          setState={setATState}
        />
      )}
      {emstate.visible && (
        <EditTypeModal
          types={types}
          setTypes={setTypes}
          state={emstate}
          typeId={typeId}
          setState={setEMState}
        />
      )}
      {dmstate.visible && (
        <DeleteModal
          title={typeName}
          typeId={typeId}
          setTypes={setTypes}
          state={dmstate}
          setState={setDMState}
        />
      )}
      {/* RENDERS RECORDS FOR EACH TYPE */}
      {typeId && !props.mapState && (
        <RenderRecords setTypes={setTypes} typeId={typeId} types={types} />
      )}
    </nav>
  );
};

export default DesktopNav;
