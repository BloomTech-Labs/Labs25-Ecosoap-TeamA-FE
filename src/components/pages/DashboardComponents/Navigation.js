import React from 'react';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

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
      />
      <MobileNav
        setMapState={props.setMapState}
        mapState={props.mapState}
        typeId={props.typeId}
        setTypeId={props.setTypeId}
        types={props.types}
        setTypes={props.setTypes}
      />
    </div>
  );
};

export default Navigation;
