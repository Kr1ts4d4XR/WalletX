const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('https://bsc-dataseed1.binance.org/');

const walletFile = './wallet.json';
let wallets = [];

function generateWallet(name) {
  const account = web3.eth.accounts.create();
  const address = account.address;
  const privateKey = account.privateKey;
  return {
    name: name,
    address: address,
    privateKey: privateKey
  };
}

function saveWallet(wallet) {
    const existingWallet = wallets.find(w => w.name === wallet.name);
    if (existingWallet) {
      console.log(`Wallet '${wallet.name}' already exists`);
      return;
    }
    wallets.push(wallet);
    const data = JSON.stringify(wallets, null, 2);
    fs.writeFileSync(walletFile, data);
    console.log(`Wallet '${wallet.name}' has been generated and saved to '${walletFile}'`);
}
  

function loadWallets() {
  if (fs.existsSync(walletFile)) {
    const data = fs.readFileSync(walletFile);
    wallets = JSON.parse(data);
  }
}

function getBalance(name) {
  const wallet = wallets.find(wallet => wallet.name === name);
  if (!wallet) {
    console.log(`Wallet '${name}' does not exist`);
    return;
  }
  web3.eth.getBalance(wallet.address, (error, balance) => {
    if (error) {
      console.log(`Error occurred while getting balance for wallet '${name}': ${error}`);
    } else {
      console.log(`Balance for wallet '${name}': ${web3.utils.fromWei(balance)} BNB`);
    }
  });
}

function sendBNB(fromName, toAddress, value) {
    const fromWallet = wallets.find(wallet => wallet.name === fromName);
    if (!fromWallet) {
      console.log(`Wallet '${fromName}' does not exist`);
      return;
    }
  
    const toAddressChecksum = web3.utils.toChecksumAddress(toAddress);
    if (!web3.utils.isAddress(toAddressChecksum)) {
      console.log(`Invalid address: ${toAddress}`);
      return;
    }
  
    const valueInWei = web3.utils.toWei(value.toString(), 'ether');
  
    web3.eth.getTransactionCount(fromWallet.address, (error, txCount) => {
      if (error) {
        console.log(`Error occurred while getting transaction count for wallet '${fromName}': ${error}`);
        return;
      }
  
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: toAddressChecksum,
        value: web3.utils.toHex(valueInWei),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
      };
  
      const tx = new Tx.Transaction(txObject, { 'chain': 'bsc', 'hardfork': 'petersburg' });
      tx.sign(Buffer.from(fromWallet.privateKey.slice(2), 'hex'));
  
      const serializedTx = tx.serialize();
      const raw = '0x' + serializedTx.toString('hex');
  
      web3.eth.sendSignedTransaction(raw, (error, txHash) => {
        if (error) {
          console.log(`Error occurred while sending transaction from wallet '${fromName}': ${error}`);
        } else {
          console.log(`Transaction '${txHash}' has been sent from wallet '${fromName}' to '${toAddress}'`);
        }
      });
    });
}

function receive(walletName) {
    const wallet = wallets.find(wallet => wallet.name === walletName);
    if (!wallet) {
      console.log(`Wallet '${walletName}' does not exist`);
      return;
    }
    console.log(`Send BNB to this address: ${wallet.address}`);
  }
  
loadWallets();

const args = process.argv.slice(2);
const command = args[0];
const walletName = args[1];

switch (command) {
  case 'gen':
    const wallet = generateWallet(walletName);
    saveWallet(wallet);
    break;
  case 'send':
  const fromName = args[1];
  const toAddress = args[2];
  const value = args[3];
  sendBNB(fromName, toAddress, value);
  break;
  case 'rec':
    receive(walletName);
    break;
  case 'bal':
    getBalance(walletName);
    break;
  default:
    console.log(`Invalid command: ${command}`);
}
