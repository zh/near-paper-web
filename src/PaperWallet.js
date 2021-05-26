import { utils, KeyPair } from 'near-api-js';
import getConfig from './config.js';

const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

class PaperWallet {
  constructor(props) {
    const { near, wallet, currentUser } = props;
    this.initialize();
    this.api = near;
    this.wallet = wallet;
    this.creator = currentUser.accountId;
  }

  initialize(name = 'unknown', privateKey = 'unknown') {
    this.name = name;
    this.privateKey = privateKey;
  }

  async create() {
    try {
      const account = this.wallet.account();
      const keyStore = account.connection.signer.keyStore;
      const paperId = `paper-${Date.now()}.${this.creator}`;
      const keyPair = KeyPair.fromRandom('ed25519');
      this.initialize(paperId, keyPair.secretKey);
      const chargeAmount = utils.format.parseNearAmount('2.5');
      await keyStore.setKey(nearConfig.networkId, paperId, keyPair);
      const result = await account.createAccount(
        paperId,
        keyPair.publicKey,
        chargeAmount
      );
      console.log('Create Results: ', result.transaction);
      return paperId;
    } catch (error) {
      console.log('PaperWallet.create(): ', error);
      throw error;
    }
  }

  async sweep(paperId, privateKey, receiver) {
    try {
      this.initialize(paperId, privateKey);
      const account = this.wallet.account();
      const keyStore = account.connection.signer.keyStore;
      const keyPair = KeyPair.fromString(privateKey);
      await keyStore.setKey(nearConfig.networkId, paperId, keyPair);
      const paperAccount = await this.api.account(paperId);
      const balance = await paperAccount.getAccountBalance();
      console.log(`balance: ${JSON.stringify(balance.available, null, 2)}`);
      const result = await paperAccount.sendMoney(receiver, balance.available);
      // console results
      console.log('Transaction Results: ', result.transaction);
      await paperAccount.deleteAccount(receiver); // will get the remaining tokens too
    } catch (error) {
      console.log('PaperWallet.sweep(): ', error);
      throw error;
    }
  }

  async;
}

export default PaperWallet;
