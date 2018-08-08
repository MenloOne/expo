var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {

  let dotEnv = './chain/' + network + '.env'
  require('dotenv').config({ path: dotEnv })
  let root = process.env.MENLO_ROOT

  // Fund personal account with MET
  let amount = 10000000000000000000000;
  AppToken.deployed().then(token => {
    token.transfer(root, amount);
    token.approve(Forum.address, amount, {from: root});
  })
}
