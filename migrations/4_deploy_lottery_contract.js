var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = (deployer, network) => {
  return deployer.deploy(Lottery, AppToken.address, Forum.address)
}
