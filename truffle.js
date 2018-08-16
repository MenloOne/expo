var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")

// var HDWalletProvider = require('truffle-hdwallet-provider');
// require('dotenv').config({ path: './.mnemonic.env' })
// const mnemonic = process.env.MNEMONIC

var HDWalletProvider = require('truffle-hdwallet-provider-privkey');
var keys = []
keys.push(require('./chain/root.json'))
keys.push(require('./chain/tenet1.json'))
keys.push(require('./chain/tenet2.json'))
keys.push(require('./chain/tenet3.json'))
var privKeys = keys.map((js) => js.privateKey.substr(2) /* Skip 0x */)

function noncedWallet(wallet) {
  var nonceTracker = new NonceTrackerSubprovider()
  wallet.engine._providers.unshift(nonceTracker)
  nonceTracker.setEngine(wallet.engine)
  return wallet
}

module.exports = {
  migrations_directory: './migrations',
  networks: {
    live: {
      provider: function() {
        return noncedWallet(new HDWalletProvider(privKeys, 'https://mainnet.infura.io/v3/1b81fcc6e29d459ca28861e0901aba99'))
      },
      network_id: '1',
      gas: 4700000,
    },
    develop: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*'
    },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777
    },
    ropsten: {
      provider: function() {
        return noncedWallet(new HDWalletProvider(privKeys, 'https://ropsten.infura.io/v3/1b81fcc6e29d459ca28861e0901aba99'))
      },
      network_id: '3',
      gas: 4700000,
    },
    kovan: {
      provider: function() {
        return noncedWallet(new HDWalletProvider(privKeys, 'https://kovan.infura.io/v3/1b81fcc6e29d459ca28861e0901aba99'))
      },
      network_id: 42,
      gas: 4700000,
      gasPrice: 150000000000
    },
    rinkeby: {
      host: '127.0.0.1',
      port: 8545,
      gas: 4612388,
      network_id: 4,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 0
    }
  }
}
