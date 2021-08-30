require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.6",
  networks: {
    rinkeby: {
      url: process.env.URL,
      accounts: [`0x${process.env.KEY}`] 
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [`0x${process.env.KEY}`] 
    }
  }
};
