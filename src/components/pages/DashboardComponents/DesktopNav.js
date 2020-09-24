// DEPENDENCY IMPORTS
import React, { useEffect, useState } from 'react';

// OKTA IMPORTS
import { useOktaAuth } from '@okta/okta-react';

// STYLING IMPORTS
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

//GRAPHQL IMPORTS
import { client } from '../../../index.js';
import { FETCH_TYPES, FETCH_USERS } from '../../../graphql/queries.js';

//COMPONENT IMPORTS
import ATModal from '../../types/addtype/ATModal.jsx';
import EditTypeModal from '../../types/edittype/EditTypeModal.jsx';
import DeleteModal from '../../types/deletetype/DeleteModal.jsx';
import TypeButton from '../../types/TypeButton.jsx';
import UsersModal from '../../users/UsersModal.jsx';

// ASSET IMPORTS
import logo from '../../../assets/ecosoapbanklogopng.png';

// DESKTOP NAV COMPONENT
const DesktopNav = props => {
  const {
    typeId,
    setTypeId,
    types,
    setTypes,
    tableState,
    setTableState,
    recordsState,
    setRecordsState,
    activeStyles,
  } = props;
  // OKTA AUTHORIZATION HOOK
  const { authService } = useOktaAuth();
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
  // USER MODAL STATE AND FUNCTIONALITY
  const [users, setUsers] = useState([]);
  const [usrState, setUsrState] = useState({
    visible: false,
    loading: false,
  });
  function showUsersModal() {
    setUsrState({
      ...usrState,
      visible: !usrState.visible,
    });
  }
  function getUsers() {
    client
      .query({ query: FETCH_USERS })
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(console.log);
  }
  // EDIT MODAL => STATE AND SHOW BUTTON FUNCTION
  const [emstate, setEMState] = useState({
    visible: false,
    loading: false,
  });
  // DELETE MODAL => STATE AND SHOW BUTTON FUNCTIONALITY
  const [dmstate, setDMState] = useState({
    visible: false,
    loading: false,
  });
  const [typeName, setTypeName] = useState('');
  // const [activeButton, setActiveButton] = useState('')
  // GET ALL TYPES - THIS WILL ALLOW US TO MAP THROUGH THEM ALL TO CREATE DYNAMIC BUTTONS
  function getTypes() {
    client
      .query({ query: FETCH_TYPES })
      .then(res => {
        setTypes(res.data.types);
      })
      .catch(console.log);
  }
  // RUN THE GET TYPES FUNCTION EVERYTIME THE COMPONENT LOADS
  // ALSO RUNS WHEN YOU CLICK ON A NEW TYPE BUTTON
  useEffect(() => {
    getTypes();
  }, [types.length]);

  useEffect(() => {
    getUsers();
  }, [users.length]);

  return (
    <nav className="desktopNav">
      <div className="desktopLogo">
        <img src={logo} alt="EcoSoapBank logo" />
      </div>
      <div className="dbButtons">
        <Button
          onClick={e => {
            props.setMapState(true);
            activeStyles('mapBtn');
          }}
          style={{ cursor: 'pointer' }}
          className="navBtn mapBtn"
          id="active"
        >
          Map
        </Button>
        {/* THIS DYNAMICALLY CREATES A BUTTON FOR EACH OF THE TYPES */}
        {types &&
          types.map(type => {
            return (
              <TypeButton
                key={type.id}
                type={type}
                emstate={emstate}
                setEMState={setEMState}
                dmstate={dmstate}
                setDMState={setDMState}
                setTypeId={setTypeId}
                setTypeName={setTypeName}
                setMapState={props.setMapState}
                activeStyles={activeStyles}
              />
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
      <div className="homepagebuttons">
        {/* HOUSES THE USERS MODAL AND THE LOGOUT FUNCTIONALITY */}
        <div className="usersBtn">
          <Button type="link" onClick={() => showUsersModal()}>
            Users
          </Button>
        </div>
        <div className="adminSignOut">
          <Button type="link" onClick={() => authService.logout()}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* MODALS RENDERED WHEN THE VISIBLE STATE IS CHANGED TO TRUE */}
      {atstate.visible && (
        <ATModal
          types={types}
          setTypes={setTypes}
          setTypeId={setTypeId}
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
          tableState={tableState}
          setTableState={setTableState}
          recordsState={recordsState}
          setRecordsState={setRecordsState}
        />
      )}
      {dmstate.visible && (
        <DeleteModal
          title={typeName}
          typeId={typeId}
          setTypeId={setTypeId}
          setTypes={setTypes}
          state={dmstate}
          setState={setDMState}
        />
      )}
      {usrState.visible && (
        <UsersModal
          state={usrState}
          setState={setUsrState}
          users={users}
          setUsers={setUsers}
        />
      )}
    </nav>
  );
};

export default DesktopNav;
