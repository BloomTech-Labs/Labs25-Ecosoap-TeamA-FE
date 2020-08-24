import React from 'react';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navigation = () => {
  return (
    <div className="mainNavigation">
      <DesktopNav />
      <MobileNav />
    </div>
  );
};

export default Navigation;
