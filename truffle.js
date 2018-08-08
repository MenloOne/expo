module.exports = {
  migrations_directory: "./migrations",
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    ropsten: {
      host: "localhost",
      port:  8545,
      gas:   2900000,
      network_id: '3',
    },
    kovan: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 42,
      gas: 4700000
    },
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      gas: 4612388,
      network_id: 4,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
}
