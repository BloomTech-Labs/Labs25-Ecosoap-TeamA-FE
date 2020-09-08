import React, { useState } from 'react';
import Navigation from '../DashboardComponents/Navigation';
import Map from '../DashboardComponents/Map';
import '../../../styles/css/index.css';

function RenderHomePage(props) {
  const [mapState, setMapState] = useState(true);

  return (
    <div className="dashboard">
      <Navigation setMapState={setMapState} />
      {mapState && <Map mapState={mapState} />}
    </div>
  );
}
export default RenderHomePage;
