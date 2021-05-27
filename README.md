# NEAR paper wallets generator

[Paper Wallets](https://privacypros.io/wallets/paper/) are great way to onboard new users.
They are also a great way to save funds off-chain (cold storage).

Technically it is not a difficult task - just **two QR codes with public and private key**. However some sweeping functionality need to be added to the real wallets.

In case of NEAR blockchain **account name** for the wallet also need to be provided. Something as *paper-xxx.somebody.testnet*, where *somebody.testnet* is the parent account, which will create and initially fund the wallet.


## Used libraries and services

The paper wallet generator is implemented as a SPA React application. Used libraries:

- [near-api-js](https://github.com/near/near-api-js) - A JavaScript/TypeScript library for development of DApps on the NEAR platform
- [react-st-modal](https://github.com/Nodlik/react-st-modal) - a simple and flexible library for implementing modal dialogs.
- [qrcode.react](https://github.com/zpao/qrcode.react) - A React component to generate QR codes


## Installation

```sh
git clone https://github.com/zh/near-paper-web
cd near-paper-web
yarn install
```

## Usage

Start the application with

```sh
yarn start
```

You can also build it as static HTML pages (for example from deploying on IPFS):

```
yarn build
```

On visit to the front page, login is required. Clicking on the **'Log in'** button in the top left corner will redirect you to your NEAR web wallet for approval.

After successful login the table with account name and balance will be visible.

Another table with created until now paper wallets (will be empty on the first visit) is also available.

Clicking on the **'Create new'** button will open modal dialog, asking for initial amount of NEAR to fund the paper walllet. **Creating new wallet require approval via NEAR web wallet.**

Clicking on the **'Show'** button will show a dialog with two QR codes:

- **PUBLIC** - for public access, similar to the **'Receive'** QR code in your NEAR wallet. The format of the encoded URL is: *https://wallet.testnet.near.org/send-money/${paperId}*. With this QR code you can always add new funds to the paper wallet.
- **SECRET** - for private access. Some sweep (get funds) functionallity need to be added to the existing wallets to use this one. Format of the code is: *${paperId}:${privateKey}*

There is also **'Print'** button is this dialog for printing the paper wallet.

For now sweeping is impossible in the NEAR wallet, so clicking on the **'Sweep'** button will allow you to get the funds back or send them to somebody else. **Sweeping require approval via NEAR wallet.**

> TODO: Create simple stand-alone sweeper application:
> 
> * get receiver address
> * read **SECRET** QR code
> * send the finds.