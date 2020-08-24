import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import logo from '../../../assets/ecosoapbanklogopng.png';
import { useHistory } from 'react-router-dom';

import { Menu } from 'antd';
import { useOktaAuth } from '@okta/okta-react';

const { SubMenu } = Menu;

const MobileNav = () => {
  const { push } = useHistory();
  const { authService } = useOktaAuth();

  return (
    <nav className="mobileNav">
      <div className="mobileLogo">
        <img src={logo} alt="EcoSoapBank logo" />
      </div>
      <div className="mobileMenu">
        <Menu mode="horizontal">
          <SubMenu
            icon={<MenuOutlined style={{ fontSize: '25px' }} />}
            title="Menu"
          >
            <Menu.Item onClick={() => push('/')}>Map</Menu.Item>
            <Menu.Item onClick={() => push('/hubs')}>Hubs</Menu.Item>

            <Menu.Item onClick={() => push('/hotels')}>
              Hotel Partners
            </Menu.Item>
            <Menu.Item onClick={() => push('/manufacturers')}>
              Manufacturing Partners
            </Menu.Item>
            <Menu.Item
              style={{ color: 'red' }}
              onClick={() => authService.logout()}
            >
              Sign Out
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </nav>
  );
};

export default MobileNav;
