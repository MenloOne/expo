var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = (deployer, network) => {
  var trustee1, trustee2

  let dotEnv = './chain/' + network + '.env'
  require('dotenv').config({ path: dotEnv })
  trustee1 = process.env.MENLO_TENET_1.toLowerCase()
  trustee2 = process.env.MENLO_TENET_2.toLowerCase()

  let forum;
  return Forum.deployed().then(instance => forum = instance)
    .then(() => Lottery.deployed())
    .then(lottery => {
      forum.setBeneficiary(lottery.address);
      AppToken.deployed()
      .then(token => {
        token.install(lottery.address, {from: trustee1} );
        token.install(lottery.address, {from: trustee2} );
      })
    })
}
