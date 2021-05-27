import { useState, useEffect } from 'react';
import { CustomDialog } from 'react-st-modal';
import { utils } from 'near-api-js';
import Home from './Home';
import QRCodeModal from './QRCodeModal';
import CreateModal from './CreateModal';
import SweepModal from './SweepModal';
import PaperWallet from './PaperWallet';

const defaultAmount = '2.0'; // default amount to fund new wallets

function App(props) {
  const { near, currentUser, nearConfig, wallet } = props;
  const [generator, setGenerator] = useState(null);
  const [papers, setPapers] = useState(new Map());
  const [loading, setLoading] = useState(false);

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
      const amount = await CustomDialog(
        <CreateModal amount={defaultAmount} />,
        {
          title: 'New paper wallet',
          showCloseIcon: true,
        }
      );
      if (amount) {
        // const paperId = await generator.create();
        if (isNaN(amount)) throw new Error('invalid number');
        setLoading(true);
        const paperId = await generator.create(amount.toString());
        console.log(paperId);
      } else {
        console.log('no wallet created');
      }
    } catch (error) {
      console.log('create: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSweep = async (paperId, privateKey) => {
    if (!generator) return;

    try {
      const receiver = await CustomDialog(
        <SweepModal receiver={currentUser.accountId} />,
        {
          title: 'Receiver',
          showCloseIcon: true,
        }
      );
      if (receiver) {
        // maybe need fix for mainnet -> near
        const fixedReceiver = receiver.endsWith(`.${nearConfig.accountEnd}`)
          ? receiver
          : `${receiver}. ${nearConfig.accountEnd}`;
        setLoading(true);
        await generator.sweep(paperId, privateKey, fixedReceiver);
        const keyName = `near-api-js:keystore:${paperId}:${nearConfig.networkId}`;
        window.localStorage.removeItem(keyName);
      } else {
        console.log('no receiver provided');
      }
    } catch (error) {
      console.log('sweep: ', error);
    } finally {
      setLoading(false);
      window.location.replace(
        window.location.origin + window.location.pathname
      );
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

  return (
    <div className="App">
      <header className="App-header">
        {currentUser ? (
          <button disabled={loading} onClick={signOut}>
            Log out
          </button>
        ) : (
          <button onClick={signIn}>Log in</button>
        )}
        <h3>NEAR Paper Wallets Generator</h3>
      </header>
      {currentUser ? (
        <>
          <h3>Account</h3>
          <table id="balance" className="center">
            <thead>
              <tr>
                <th>User</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentUser.accountId}</td>
                <td>{utils.format.formatNearAmount(currentUser.balance, 6)}</td>
              </tr>
            </tbody>
          </table>
          <h3>Paper Wallets</h3>
          {loading && <div style={{ color: 'red' }}>Loading...</div>}
          <table id="wallets">
            <thead>
              <tr>
                <th>Wallets</th>
                <th>
                  <div>
                    <button disabled={loading} onClick={() => handleCreate()}>
                      Create New
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...papers.keys()].map((paper) => {
                return (
                  <tr key={paper}>
                    <td>{paper}</td>
                    <td>
                      <button
                        disabled={loading}
                        onClick={() => handleQRcode(paper, papers.get(paper))}
                      >
                        Show
                      </button>{' '}
                      <button
                        disabled={loading}
                        onClick={() => handleSweep(paper, papers.get(paper))}
                      >
                        Sweep
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <Home />
      )}
      <footer className="App-footer">
        Sources on{' '}
        <a
          href="https://github.com/zh/near-paper-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

export default App;
