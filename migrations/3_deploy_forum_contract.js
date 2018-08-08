var Forum = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {
  return deployer.deploy(Forum);
}
