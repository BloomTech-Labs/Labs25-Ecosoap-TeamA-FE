import React from 'react';
import Navigation from '../DashboardComponents/Navigation';
import Map from '../DashboardComponents/Map';
import '../../../styles/css/index.css';

function RenderHomePage(props) {
  return (
    <div className="dashboard">
      <Navigation />
      <Map />
    </div>
  );
}
export default RenderHomePage;
