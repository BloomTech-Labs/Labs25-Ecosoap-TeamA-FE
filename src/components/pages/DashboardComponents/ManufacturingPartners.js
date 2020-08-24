import React, { useState } from 'react';
import { Input, Button } from 'antd';
import Navigation from './Navigation';
import CRModal from '../../modal/CRModal';

const { Search } = Input;

const Manufacturer = () => {
  const [state, setState] = useState({ visible: false, loading: false });
  function showButton() {
    setState({ ...state, visible: !state.visible });
  }
  const titleText = 'Add Manufacturer Partner';
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
            Add Manufacturer
          </Button>
          {state.visible && (
            <CRModal state={state} setState={setState} titleText={titleText} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;
