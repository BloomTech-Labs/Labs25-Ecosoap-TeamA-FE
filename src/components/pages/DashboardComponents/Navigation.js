import React from 'react';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navigation = props => {
  return (
    <div className="mainNavigation">
      <DesktopNav setMapState={props.setMapState} mapState={props.mapState} />
      <MobileNav setMapState={props.setMapState} mapState={props.mapState} />
    </div>
  );
};

export default Navigation;
