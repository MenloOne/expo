var MenloToken = artifacts.require("menlo-token/MenloToken.sol");
var MenloFaucet = artifacts.require("./MenloFaucet.sol");

module.exports = (deployer, network) => {

    const asyncDeploy = async () => {
        let token = await MenloToken.deployed()

        try {
            console.log('Deploying faucet')
            let menloFaucet = await deployer.deploy(MenloFaucet, MenloToken.address, 100 * 10**18, 24 * 60 * 60 /* One day */); // await MenloFaucet.deployed()

            console.log('Transfer partner tokens to faucet')
            await token.transfer(menloFaucet.address, 100000 * 10**18, { from : '0x079542865f27d7b22b47cfed901f9fb29ce3206e' }) // Give partner wallet tokens
        } catch (e) {
            throw(e)
        }
    }

    deployer.then(async () => await asyncDeploy())
}
