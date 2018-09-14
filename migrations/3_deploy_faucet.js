var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var MenloFaucet = artifacts.require("./MenloFaucet.sol");

module.exports = (deployer, network) => {

    const asyncDeploy = async () => {
        let token = await MenloToken.deployed()

        try {
            console.log('Deploying faucet')
            let menloFaucet = await deployer.deploy(MenloFaucet, MenloToken.address); // await MenloFaucet.deployed()

            console.log('Transfer partner tokens to faucet')
            await token.transfer(menloFaucet.address, 100000 * 10**18, { from : '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2' }) // Give partner wallet tokens
        } catch (e) {
            throw(e)
        }
    }

    deployer.then(async () => await asyncDeploy())
}
