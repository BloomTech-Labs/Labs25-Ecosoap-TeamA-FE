import React from 'react';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navigation = props => {
  return (
    <div className="mainNavigation">
      <DesktopNav setMapState={props.setMapState} />
      <MobileNav setMapState={props.setMapState} />
    </div>
  );
};

export default Navigation;
