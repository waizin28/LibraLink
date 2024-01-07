export const oktaConfig = {
    clientId: '0oaeb2q69b8AWWwN35d7',
    issuer: 'https://dev-64658467.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}