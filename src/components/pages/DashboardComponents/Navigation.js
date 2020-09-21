import React from 'react';

import DesktopNav from './DesktopNav';

const Navigation = props => {
  return (
    <div className="mainNavigation">
      <DesktopNav
        setMapState={props.setMapState}
        mapState={props.mapState}
        typeId={props.typeId}
        setTypeId={props.setTypeId}
        types={props.types}
        setTypes={props.setTypes}
        tableState={props.tableState}
        setTableState={props.setTableState}
        recordsState={props.recordsState}
        setRecordsState={props.setRecordsState}
        activeStyles={props.activeStyles}
      />
    </div>
  );
};

export default Navigation;
