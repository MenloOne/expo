var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var Forum      = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {
  return deployer.deploy(Forum, MenloToken.address);
}
