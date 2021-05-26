import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js';

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  return { near, currentUser, nearConfig, walletConnection };
}
window.nearInitPromise = initContract().then(
  ({ near, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <React.StrictMode>
        <App
          near={near}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={walletConnection}
        />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
);
