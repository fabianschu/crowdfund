import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-typechain";

const { INFURA_KEY, deployerPrivateKey } = require("./env.json");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  typechain: {
    outDir: "ts-types/contracts",
    target: "ethers-v5",
  },
  networks: {
    rinkeby: {
      accounts: [deployerPrivateKey],
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: "UKN1A8ZEUJ15ZIBHZHXJFD6J8HNN1MF71I",
    },
  },
};

export default config;
