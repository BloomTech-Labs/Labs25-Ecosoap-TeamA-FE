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
  // TABLE STATE - USED TO UPDATE TABLE
  const [tableState, setTableState] = useState(true);
  // RECORDS STATE
  const [recordsState, setRecordsState] = useState(null);
  // SET ACTIVE BUTTON
  function activeStyles(id) {
    var current = document.getElementById('active');
    current.id = '';
    var target = document.getElementsByClassName(`${id}`)[0];
    target.id = 'active';
  }

  return (
    <div className="dashboard">
      <Navigation
        setMapState={setMapState}
        mapState={mapState}
        typeId={typeId}
        setTypeId={setTypeId}
        types={types}
        setTypes={setTypes}
        tableState={tableState}
        setTableState={setTableState}
        recordsState={recordsState}
        setRecordsState={setRecordsState}
        activeStyles={activeStyles}
      />
      <div className="dashboardComponents">
        {mapState && <Map mapState={mapState} />}

        {typeId && !mapState && (
          <RenderRecords
            setTypes={setTypes}
            typeId={typeId}
            types={types}
            tableState={tableState}
            setTableState={setTableState}
            recordsState={recordsState}
            setRecordsState={setRecordsState}
            activeStyles={activeStyles}
            setMapState={setMapState}
          />
        )}
      </div>
    </div>
  );
}
export default RenderHomePage;
