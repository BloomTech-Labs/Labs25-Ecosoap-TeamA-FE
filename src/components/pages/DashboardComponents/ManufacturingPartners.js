import React from 'react';
import { Input, Button } from 'antd';
import Navigation from './Navigation';

const { Search } = Input;

const Manufacturer = () => {
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
          <Button type="dashed">Add Manufacturer</Button>
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;