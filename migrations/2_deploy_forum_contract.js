var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var Forum      = artifacts.require("./MenloForum.sol");

module.exports = (deployer, network) => {
  return deployer.deploy(Forum, MenloToken.address, 5 * 10**18 /* 5 Votes to post */, 0 * 10**18 /* 0 Tokens for voting */, 15 * 60 /* 15 mins */);
}
