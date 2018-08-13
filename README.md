# Menlo One Expo - Demo of Townhall consumer

Find out about Menlo One: [https://www.menlo.one/](https://www.menlo.one/)

Townhall Information: [https://www.menlo.one/#/townhall](https://www.menlo.one/#/townhall)

Expo Repo: [https://www.github.com/menloone/expo-demo](https://www.github.com/menloone/expo-demo)

## Local "Develop" Environment


To develop and run Expo locally, install the following prerequisites and
dependencies before running the app.

### Prerequisites

#### Brew

We assume `brew` for package management to install `IPFS` and other dependencies:

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#### IPFS

TownHall uses [IPFS](https://ipfs.io/) for storage of messages.

Menlo specific setup of IPFS can be installed and configured via:

        yarn run menlo:setup

#### Metamask

Metamask should be used for interacting with the town hall dApp.

Install Metamask extensions into your browser of choice, Chrome or Brave supported: [http://metamask.io](http://metamask.io)


#### Import development chain account

Import this private key into MetaMask for use with `truffle develop`:

        388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418


![MetaMask Import](https://www.dropbox.com/s/aqmmv5xk67haqwn/import-account.png?raw=1)

### Install app and dependencies

1. Install nvm and node: `brew install nvm && nvm install`
2. Clone the repo: `git clone git@github.com:MenloOne/townhall.git`
3. Install dependencies: `cd townhall && nvm use && yarn install`

### Run the application

1. Run a local dev blockchain in a separate window: `yarn run truffle develop`
2. Run IPFS daemon in a separate window: `ipfs daemon`
3. Now, deploy the contracts: `yarn run truffle deploy --network deploy`
4. Run the app: `yarn start`

### Interact with Expo

A browser window should open after starting: `http://localhost:3000/`

Ensure you are logged into MetaMask and switch to your imported account.

Add a Custom RPC in MetaMask with URL `http://127.0.0.1:9545/`:

![MetaMaskNetwork](https://www.dropbox.com/s/gtjut6mz97owleo/MetaMaskNetwork.png?raw=1)



## Using the Ropsten Network 

We have already deployed the contracts included in this repo to the Ropsten network.  
To use the network just run the site pointing at the Ropsten build contracts and 
use Metamask against Kovan.

### Getting ETH

To get ETH in your account once on Ropsten, go to the [Ropsten ETH Faucet](http://faucet.ropsten.be:3001/)

### Running with Kovan contracts

`yarn start kovan`



### To deploy Kovan contracts


1. Install Parity `brew install parity`
2. Run Parity `parity --geth --chain kovan`
3. Install and Run Parity UI
4. Create a Root Parity Account in Parity UI and get ETH 
5. Create a new `chain/kovan.env` file and paste the Root Parity Account in it:
 
    `MENLO_ROOT=0x004ccE088463Eb2DC7ab23952d5744410000000`

6. Create Kovan accounts for use in contracts.  

     `yarn run create-accounts kovan` 

7. Deploy the contracts

      `yarn run truffle deploy --network kovan`
      
      

## Using other Environments

If for some reason Truffle doesn't work for you or you want a different environment the first thing you will
need is to fill out the `.env` file with the following accounts that you create in your chain.  For Ganache, 
you can just copy some of the precreated accounts:


    - MENLO_ROOT: Address of pre-configured account on chain.

Menlo Root should be the first created account w/ some ETH which we can then use to
create the accounts below on chains such as Parity.
     
    - MENLO_TENET_1: Address for first tenet account.
    - MENLO_TENET_2: Address for second tenet account.
    - MENLO_TENET_3: Address for third tenet account.
    - MENLO_ROOT: Address for the account used to interact with town hall.


#### Ganache

For a light, easy to use private chain with a visual and cli interface,
try [Ganache](http://truffleframework.com/ganache/).

You can deploy and test using network ganache:

    yarn run truffle deploy --network ganache

**Note**: Ganache and truffle develop are transitory. Once you shut them down,
you will have to redeploy the contracts and redo any needed transactions.

## Integration

For a persistent local testing environment to test before deploying to
testnet or mainnet, use a Dev chain with Parity or Geth.


### Parity

To run a private dev chain with Parity, first run a dev chain, setup Menlo accounts, and
then deploy contracts.

#### Install Parity

Installing Parity:

        brew install parity


#### Run unlocked dev chain

Create an account on Parity.  For dev you can use:

    parity account new --chain dev --keys-path /Users/dave/Library/Application\ Support/io.parity.ethereum/keys

Take the resulting account number and add it as personal in your `.env`

    MENLO_ROOT=0xaddress

You need to unlock your dev account to be able to run Truffle migrations easily.
The following script runs parity with an unlocked dev account, it will need
to be modified if you've changed the default dev account:

        ./scripts/parity-unlocked-dev.sh

#### Set up Menlo accounts

Create the needed Menlo accounts:

        yarn run truffle menlo:create-accounts --network integration 

After running the account creation, a set of accounts will be displayed to
add to your `.env` file.

Add `MENLO_TENET_1`, `MENLO_TENET_2`, `MENLO_TENET_3`, and `MENLO_ROOT` to you `.env`.

#### Deploy Contracts

Once you add the environment variables to your account, rerun parity with the
helper script:

        yarn run menlo:parity-dev-chain

Now deploy the contracts, use the `integration` network defined in `truffle.js` when using parity.

        yarn run truffle deploy --network integration

Your contracts will live between parity dev runs, you can check the contracts addresses to watch with `truffle network`.

Browse [http://localhost:8180](http://localhost:8180) to interact with the Parity wallet.

Parity has a lot of config and features: [Read the effin manual](https://wiki.parity.io/Private-development-chain)

#### Subsequent runs

        yarn run menlo:parity-dev-chain

### Testing

For testing the TownHall dapp:

      yarn test

For testing the town hall contracts:

      dapp update
      dapp test

### Deployment

Set the following environment variables:

          1. MENLO_DEPLOYMENT_KEY:
          2. MENLO_DEPLOYMENT_SERVER:

Deploy to server using `shipit`:

      yarn run menlo:deploy

## Staging and Testnet

### Rinkeby & Mist

MetaMask can be used with a Rinkeby account to test against.

The [Mist](https://github.com/ethereum/mist/releases) browser can be used to test the Rinkeby testnet.

Mist uses [Geth](https://github.com/ethereum/go-ethereum) underneath:

        brew install geth

Run Geth against Rinkeby with the Apis needed by Truffle:

        geth --rinkeby --rpc --rpcapi db,eth,net,web3,root --rpccorsdomain http://localhost:3000

Now, run Mist against your local instance of Geth:

        /Applications/Mist.app/Contents/MacOS/Mist --rpc http://127.0.0.1:8545

**Wait for the blocks to sync** , (go for a walk and enjoy the sunshine).

After the blocks sycn, note your account hash in the Mist Wallet, you'll need it later.

Close Mist, Stop Geth.

Now, run Geth with the account you noted above unlocked:

        geth --rinkeby --rpc --rpcapi db,eth,net,web3,root --unlock="0x4B71d4020a69902E6cB1d9a387a03cF0a839d33b" --rpccorsdomain http://localhost:3000

Run Mist again:

        /Applications/Mist.app/Contents/MacOS/Mist --rpc http://127.0.0.1:8545

Now you are ready to deploy contracts and test:

        yarn run truffle deploy --network rinkeby

Go to the faucet to get some free Ether: [Rinkeby Faucet](https://faucet.rinkeby.io/)

Give your Mist account some TK/ONE tokens:

        yarn run truffle console --network rinkeby

Run the Town Hall and browse in Mist to [http://localhost:3000](http://localhost:3000).

### Kovan

#### Installing an IPFS box on AWS

* Launch an EC2 box with Ubuntu
* Setup security groups appropriately

You can follow the [IPFS AWS Tutorial](https://medium.com/textileio/tutorial-setting-up-an-ipfs-peer-part-i-de48239d82e0)


##### Install Golang and IPFS

```sudo yum update -y
   sudo yum install -y golang
   
   wget https://dist.ipfs.io/go-ipfs/v0.4.15/go-ipfs_v0.4.15_linux-amd64.tar.gz
   tar -xvf go-ipfs_v0.4.15_linux-amd64.tar.gz
```
   
##### Move executable to your bin path

```
sudo mv go-ipfs/ipfs /usr/local/bin
rm -rf go-ipfs
``` 

#### Run IPFS daemon on start

```
sudo vi /etc/systemd/system/ipfs.service
```

#### Initialize IPFS 

```
echo 'export IPFS_PATH=/data/ipfs' >>~/.bash_profile
source ~/.bash_profile
sudo mkdir -p $IPFS_PATH
sudo chown ubuntu:ubuntu $IPFS_PATH
ipfs init -p server
```


#### Configure IPFS Limits & CORS

```
ipfs config Datastore.StorageMax 20GB
ipfs config Addresses.API /ip4/127.0.0.1/tcp/8081/ws
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

#### Copy and paste unit file definition

``` 
sudo bash -c 'cat >/lib/systemd/system/ipfs.service <<EOL
[Unit]
Description=ipfs daemon
[Service]
ExecStart=/usr/local/bin/ipfs daemon --enable-gc
Restart=always
User=ubuntu
Group=ubuntu
Environment="IPFS_PATH=/data/ipfs"
[Install]
WantedBy=multi-user.target
EOL'
```

   
#### Start IPFS

```
sudo systemctl daemon-reload
sudo systemctl enable ipfs
sudo systemctl start ipfs.service
```

You can now reboot your instance and make sure IPFS is running by:

```
sudo systemctl restart ipfs
sudo systemctl status ipfs
```

#### Get Certbot to get an SSL Cert

From [https://certbot.eff.org/](https://certbot.eff.org/)

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
```

#### Use CertBot to get your SSL

First point ipfs.menlo.one (or your domain) to your AWS box.  Then:

```
sudo certbot --nginx -d ipfs.menlo.one
```

#### Setup automatic SSL renewals

``` 
```

#### Configure NGINGX

```
sudo bash -c 'cat >/etc/nginx/sites-available/default <<EOL 
server {
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ipfs.menlo.one/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ipfs.menlo.one/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    server_name ipfs.menlo.one;
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
     }
}
EOL'
```


#### Restart NGINX

``` 
sudo systemctl restart nginx
```


