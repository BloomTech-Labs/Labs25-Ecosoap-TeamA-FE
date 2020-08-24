import React from 'react';
import { Button } from 'antd';
import { useOktaAuth } from '@okta/okta-react';
import 'antd/dist/antd.css';
import logo from '../../../assets/ecosoapbanklogopng.png';
import { useHistory } from 'react-router-dom';

const DesktopNav = () => {
  const { push } = useHistory();
  const { authService } = useOktaAuth();
  return (
    <nav className="desktopNav">
      <div className="desktopLogo">
        <img src={logo} alt="EcoSoapBank logo" />
      </div>
      <div className="dbButtons">
        <Button onClick={() => push('/')}>Map</Button>
        <Button onClick={() => push('/hubs')}>Hubs</Button>
        <Button onClick={() => push('/hotels')}>Hotel Partners</Button>
        <Button onClick={() => push('/manufacturers')}>
          Manufacturing Partners
        </Button>
      </div>
      <div className="adminSignOut">
        <Button type="link" onClick={() => authService.logout()}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default DesktopNav;
