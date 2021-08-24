const query = window.location.search.substring(1);
const brandAuthCode = query.split('code=')[1];
const ndAuthLoginBtn = document.getElementById('authLoginBtn');
const ndAuthLogoutBtn = document.getElementById('authLogoutBtn');
const ndAuthProvider = document.getElementById('authProvider');
const ndAuthClientId = document.getElementById('authClientId');
const ndAuthDomainURL = document.getElementById('authDomainURL');
const sRedirectURL = window.location.origin;
let bAuthenticated = false;

// Internal methods

//** Handle show/hide of Login button */

function toggleLogin() {
  if (bAuthenticated) {
    ndAuthLoginBtn.parentElement.style.display = 'none';
    ndAuthLogoutBtn.parentElement.style.display = 'block';
  } else {
    ndAuthLoginBtn.parentElement.style.display = 'block';
    ndAuthLogoutBtn.parentElement.style.display = 'none';
  }
}

ndAuthLoginBtn.onclick = function () {              // eslint-disable-line
  const sAuthProvider = ndAuthProvider.value;
  const sClientId = ndAuthClientId.value; // Ranjith - 0oa1b936uwbcnuvRF5d7
  const sDomainURL = ndAuthDomainURL.value; // Ranjith - https://dev-44395699.okta.com/oauth2/v1/authorize

  if (sClientId && sDomainURL) {
    switch (sAuthProvider) {
      case 'okta':
        const sAuthURL = `${sDomainURL}?client_id=${sClientId}&scope=openid%20email%20profile%20offline_access&response_type=code&redirect_uri=${sRedirectURL}%2Fauth%2Fcallback&state=eyJiYWNrVG9QYXRoIjoiL3ByaXZhdGUiLCJpc3N1ZXIiOiJva3RhIiwiYnl0ZXMiOiItSEhlWEV3YmNRak5fQWl3a0NkanVDNEZpQ1VPRV81emkzeFlKa1BQaWcwIn0%3D`; // eslint-disable-line

        document.getElementById('authLoginBtn').href = sAuthURL;
        break;
      default:
        break;
    }
  } else {
    if (!sClientId) document.getElementById('authClientId').classList.add('auth-input-error');
    if (!sDomainURL) document.getElementById('authDomainURL').classList.add('auth-input-error');
  }
};

toggleLogin();

// OpenId Authentication setup

// AuthProvider plugin written by the brand

Genesys('registerPlugin', 'AuthProvider', (AuthProvider) => {
  // COMMANDS

  // getAuthCode
  // getTokens
  // setTokens

  /* Register Commands */

  AuthProvider.registerCommand('getAuthCode', (e) => {
    e.resolve({
      code: brandAuthCode,
      redirectUri: `${sRedirectURL}/auth/callback`,
    });
  });


  AuthProvider.subscribe('Auth.ready', () => {
    bAuthenticated = AuthProvider.data('Auth.authenticated');
    toggleLogin();
  });

  AuthProvider.subscribe('Auth.authenticated', () => {
    bAuthenticated = true;
    toggleLogin();
  });

  // Tell CXBus your plugin is ready (mandatory)
  AuthProvider.ready();
});
