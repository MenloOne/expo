var AppToken = artifacts.require("./AppToken.sol");

function getBalance (address) {
  return new Promise (function (resolve, reject) {
    web3.eth.getBalance(address, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result.c[0]);
      }
    })
  })
}

module.exports = (deployer, network) => {
  let root, trustee1, trustee2, trustee3;

  let dotEnv = './chain/' + network + '.env'
  require('dotenv').config({ path: dotEnv })

  root = process.env.MENLO_ROOT
  trustee1 = process.env.MENLO_TENET_1
  trustee2 = process.env.MENLO_TENET_2
  trustee3 = process.env.MENLO_TENET_3

  console.log(dotEnv + ': ' + trustee1 + ',' + trustee2 + ',' + trustee3)

  return deployer.deploy(AppToken, trustee1, trustee2, trustee3)
    .then(() => {
      let nominalEth = web3.toWei(0.3, "ether")

      getBalance(trustee1).then((result) => {
        console.log('getBalance',result);
        if (result.compareTo(nominalEth) == -1) {
          web3.eth.sendTransaction({from: root, to:trustee1, value:nominalEth})
        }
      });

      getBalance(trustee2).then((result) => {
        console.log('getBalance',result);
        if (result.compareTo(nominalEth) == -1) {
          web3.eth.sendTransaction({from: root, to:trustee2, value:nominalEth})
        }
      });

      getBalance(trustee3).then((result) => {
        console.log('getBalance',result);
        if (result.compareTo(nominalEth) == -1) {
          web3.eth.sendTransaction({from: root, to:trustee3, value:nominalEth})
        }
      });

    });
}
