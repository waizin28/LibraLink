export const oktaConfig = {
  clientId: '0oam54teieb6WRRPi5d7',
  issuer: 'https://dev-10816640.okta.com/oauth2/default',
  redirectUri: 'http://localhost:3000/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: true,
  useClassicEngine: true,
};
