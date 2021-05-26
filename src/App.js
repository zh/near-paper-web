import { useState, useEffect } from 'react';
import { CustomDialog } from 'react-st-modal';
import QRCodeModal from './QRCodeModal';
import PaperWallet from './PaperWallet';

function App(props) {
  const { near, currentUser, nearConfig, wallet } = props;
  const [generator, setGenerator] = useState(null);
  const [papers, setPapers] = useState(new Map());

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, 'NEAR Paper Wallet');
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  const handleQRcode = async (paperId, privateKey) => {
    const publicURL = `https://wallet.${nearConfig.networkId}.near.org/send-money/${paperId}`;
    const privateURL = `${paperId}:${privateKey}`;
    await CustomDialog(
      <QRCodeModal publicURL={publicURL} privateURL={privateURL} />,
      {
        title: paperId,
        showCloseIcon: true,
      }
    );
  };

  const handleCreate = async () => {
    if (!generator) return;

    try {
      const paperId = await generator.create();
      console.log(paperId);
    } catch (error) {
      console.log('create: ', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (!currentUser) return;

      setGenerator(new PaperWallet({ near, wallet, currentUser }));
      const account = wallet.account();
      const keyStore = account.connection.signer.keyStore;
      const accounts = await keyStore.getAccounts(nearConfig.networkId);
      const allPapers = accounts.filter((a) => a.startsWith('paper-'));
      const mapper = new Map();
      await Promise.all(
        allPapers.map(async (p) => {
          const keyPair = await keyStore.getKey(nearConfig.networkId, p);
          mapper.set(p, keyPair.secretKey);
        })
      );
      setPapers(new Map(mapper));
    })();
  }, [nearConfig, wallet, currentUser, near]);

  const handleSweep = async (paperId, privateKey) => {
    if (!generator) return;

    try {
      // send to yourself
      await generator.sweep(paperId, privateKey, currentUser.accountId);
      const keyName = `near-api-js:keystore:${paperId}:${nearConfig.networkId}`;
      window.localStorage.removeItem(keyName);
    } catch (error) {
      console.log('sweep: ', error);
    } finally {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {currentUser ? (
          <button onClick={signOut}>Log out</button>
        ) : (
          <button onClick={signIn}>Log in</button>
        )}
      </header>
      {currentUser && (
        <>
          <div>User: {currentUser.accountId}</div>
          <div>Balance: {currentUser.balance}</div>
          <div>
            <button onClick={() => handleCreate()}>Create</button>
          </div>
          <ul>
            {[...papers.keys()].map((paper) => {
              return (
                <li key={paper}>
                  {paper}{' '}
                  <button
                    onClick={() => handleQRcode(paper, papers.get(paper))}
                  >
                    Show
                  </button>{' '}
                  <button onClick={() => handleSweep(paper, papers.get(paper))}>
                    Sweep
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
