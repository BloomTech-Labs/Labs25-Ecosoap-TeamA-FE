import React from 'react';
import { Input, Button } from 'antd';
import Navigation from './Navigation';

const { Search } = Input;

const Hubs = () => {
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
          <Button type="dashed">Add Hub</Button>
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
