var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var MenloFaucet = artifacts.require("./MenloFaucet.sol");

module.exports = (deployer, network) => {

    const asyncDeploy = async () => {
        let token = await MenloToken.deployed()

        try {
            console.log('Deploying faucet')
            let menloFaucet = await deployer.deploy(MenloFaucet, MenloToken.address);

            console.log('Transfer partner tokens to faucet')
            await token.transfer(menloFaucet.address, 100000 * 10**18, { from : '0xe8234bb4573775ecad0cd2a7fced591b4312b116' }) // Give partner wallet tokens
        } catch (e) {
            throw(e)
        }
    }

    deployer.then(async () => await asyncDeploy())
}
