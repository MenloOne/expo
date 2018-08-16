var AppToken = artifacts.require("./AppToken.sol");

function getBalance (address) {
  return new Promise (function (resolve, reject) {
    web3.eth.getBalance(address, function (error, result) {
      if (error) {
        reject(error);
      } else {
        console.log('getBalance for '+ address +': ',result);
        resolve(result);
      }
    })
  })
}

module.exports = (deployer, network) => {
  let root, trustee1, trustee2, trustee3;

  let dotEnv = './chain/' + network + '.env'
  require('dotenv').config({ path: dotEnv })

  root = process.env.MENLO_ROOT.toLowerCase()
  trustee1 = process.env.MENLO_TENET_1.toLowerCase()
  trustee2 = process.env.MENLO_TENET_2.toLowerCase()
  trustee3 = process.env.MENLO_TENET_3.toLowerCase()

  console.log(dotEnv + ': ' + trustee1 + ',' + trustee2 + ',' + trustee3)

  return deployer.deploy(AppToken, trustee1, trustee2, trustee3)
    .then(() => {
      let nominalEth = web3.toWei(0.3, "ether")

      var promises = []

      promises.push(new Promise(function(resolve, reject) {
        const resolve1 = resolve
      }))

      promises.push(new Promise(function(resolve, reject) {
        const resolve2 = resolve
      }))

      promises.push(new Promise(function(resolve, reject) {
        const resolve3 = resolve
      }))

      getBalance(trustee1).then((result) => {
        if (result.comparedTo(nominalEth) === -1) {
          console.log('Funding tenet 1')
          web3.eth.sendTransaction({from: root, to:trustee1, value:nominalEth})
            .on('confirmation', (confNo, receipt) => resolve1())
        }
      });

      getBalance(trustee2).then((result) => {
        if (result.comparedTo(nominalEth) === -1) {
          console.log('Funding tenet 2')
          web3.eth.sendTransaction({from: root, to:trustee2, value:nominalEth})
            .on('confirmation', (confNo, receipt) => resolve3())
        }
      });

      getBalance(trustee3).then((result) => {
        if (result.comparedTo(nominalEth) === -1) {
          console.log('Funding tenet 3')
          web3.eth.sendTransaction({from: root, to:trustee3, value:nominalEth})
            .on('confirmation', (confNo, receipt) => resolve3())
        }
      });

      Promise.all(promises).then((values) => { process.exit() })
    });
}
