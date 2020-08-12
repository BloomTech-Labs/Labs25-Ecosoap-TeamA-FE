import React, { useEffect } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import './css/okta-sign-in.min.css';
import * as logo from '../../../assets/ecosoapbanklogopng.png';
import { config } from '../../../utils/oktaConfig';

const LoginContainer = () => {
  useEffect(() => {
    const { pkce, issuer, clientId, redirectUri, scopes } = config;
    // destructure your config so that you can pass it into the required fields in your widget.
    const widget = new OktaSignIn({
      baseUrl: issuer ? issuer.split('/oauth2')[0] : '',
      clientId,
      redirectUri,
      registration: {
        // there is more we can do to handle some errors here.
      },
      features: { registration: false },
      // turning this feature on allows your widget to use Okta for user registration
      logo: logo,
      // add your custom logo to your signing/register widget here.
      i18n: {
        en: {
          'primaryauth.title': 'Sign into EcoSoapBank Dashboard',
          // change title for your app
        },
      },
      authParams: {
        pkce,
        issuer,
        display: 'page',
        scopes,
      },
    });

    widget.renderEl(
      { el: '#sign-in-widget' },
      () => {
        /**
         * In this flow, the success handler will not be called because we redirect
         * to the Okta org for the authentication workflow.
         */
      },
      err => {
        throw err;
      }
    );
  }, []);

  return (
    <div className="login">
      <div id="sign-in-widget" />
      <p>
        Questions? Comments? Get in touch at{' '}
        <a href="mailto:support@ecosoapbank.org"> support@ecosoapbank.org</a>
      </p>
    </div>
  );
};

export default LoginContainer;
