import React, { useState } from 'react';
import { Input, Button } from 'antd';
import Navigation from './Navigation';
import CRModal from '../../modal/CRModal';

const { Search } = Input;

const Hubs = () => {
  const [state, setState] = useState({ visible: false, loading: false });
  function showButton() {
    setState({ ...state, visible: !state.visible });
  }
  const titleText = 'Add Hub';
  return (
    <div className="mainHome">
      <Navigation />
      <div className="mainHub">
        <div className="search-add">
          <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: 300 }}
          />
          <Button
            type="dashed"
            onClick={() => {
              showButton();
            }}
          >
            Add Hub
          </Button>
          {state.visible && (
            <CRModal state={state} setState={setState} titleText={titleText} />
          )}
        </div>
        <div className="mainTable">
          <h4>Hub Name</h4>
          <h4>Hub Location</h4>
        </div>
      </div>
    </div>
  );
};

export default Hubs;
