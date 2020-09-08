import React, { useState } from 'react';
import Navigation from '../DashboardComponents/Navigation';
import Map from '../DashboardComponents/Map';
import RenderRecords from '../../records/renderrecords/RenderRecords';
import '../../../styles/css/index.css';

function RenderHomePage(props) {
  const [mapState, setMapState] = useState(true);
  // STORE TYPE ID FOR USE WITH MODALS
  const [typeId, setTypeId] = useState([]);
  // TYPES STATE - MAP THROUGH THIS TO DYNAMICALLY DISPLAY TYPES
  const [types, setTypes] = useState([]);

  return (
    <div className="dashboard">
      <Navigation
        setMapState={setMapState}
        mapState={mapState}
        typeId={typeId}
        setTypeId={setTypeId}
        types={types}
        setTypes={setTypes}
      />
      <div className="dashboardComponents">
        {mapState && <Map mapState={mapState} />}

        {typeId && !mapState && (
          <RenderRecords setTypes={setTypes} typeId={typeId} types={types} />
        )}
      </div>
    </div>
  );
}
export default RenderHomePage;
