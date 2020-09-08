import React, { useState } from 'react';
import Navigation from '../DashboardComponents/Navigation';
import Map from '../DashboardComponents/Map';
import RenderRecords from '../../records/renderrecords/RenderRecords';
import '../../../styles/css/index.css';

function RenderHomePage(props) {
  const [mapState, setMapState] = useState(true);
  const [typeId, setTypeId] = useState([]);
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
      {mapState && <Map mapState={mapState} />}
      {typeId && !mapState && (
        <RenderRecords setTypes={setTypes} typeId={typeId} types={types} />
      )}
    </div>
  );
}
export default RenderHomePage;
