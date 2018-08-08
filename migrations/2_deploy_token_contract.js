var AppToken = artifacts.require("./AppToken.sol");

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
      let nominalEth = web3.toWei(1, "ether")
      web3.eth.sendTransaction({from: root, to:trustee1, value:nominalEth})
      web3.eth.sendTransaction({from: root, to:trustee2, value:nominalEth})
      web3.eth.sendTransaction({from: root, to:trustee3, value:nominalEth})
    });
}
