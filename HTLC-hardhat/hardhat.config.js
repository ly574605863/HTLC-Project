require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/b02ce4985eb44c92b4d11c55a17556cb`,
      accounts: [`0x6cca92c24a9cbfa1640d9a45d59c28dd4f4c960c3d2174d2417b55ba7d009ca0`]
    },
  }
}