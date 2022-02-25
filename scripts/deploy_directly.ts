import { ethers, waffle } from "hardhat";
import fs from "fs";

const NETWORK_MAP = {
  "1": "mainnet",
  "4": "rinkeby",
  "1337": "hardhat",
  "31337": "hardhat",
};

let isLocal = false;

async function main() {
  const chainId = (await waffle.provider.getNetwork()).chainId;

  console.log({ chainId });
  const networkName = NETWORK_MAP[chainId];

  console.log(`Deploying to ${networkName}`);

  const Proxy = await ethers.getContractFactory("CrowdfundLogic");
  const proxy = await Proxy.deploy(
    "0x9cA70B93CaE5576645F5F069524A9B9c3aef5006",
    "abc",
    "def"
  );
  await proxy.deployed();

  const info = {
    Contracts: {
      proxy: proxy.address,
    },
  };

  console.log(info);

  if (!isLocal) {
    fs.writeFileSync(
      `${__dirname}/../networks/proxy_${networkName}.json`,
      JSON.stringify(info, null, 2)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
