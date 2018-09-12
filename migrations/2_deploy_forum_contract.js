var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var Forum      = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {
  return deployer.deploy(Forum, MenloToken.address, 5 * 10**18, 0 * 10**18);
}
