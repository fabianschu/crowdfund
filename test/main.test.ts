import { expect } from "chai";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, waffle } from "hardhat";
import { CrowdfundLogic } from "../ts-types/contracts/CrowdfundLogic";
import { BigNumber, Contract } from "ethers";

let auctionAddress: string;
let mediaAddress: string;

let contentHex: string;
let contentHash: string;
let contentHashBytes: any;
let metadataHex: string;
let metadataHash: string;
let metadataHashBytes: any;

let tokenURI = "www.example.com";
let metadataURI = "www.example2.com";

let name = "Test Crowdfund";
let symbol = "TEST";
let CROWDFUND_STATUES = {
  FUNDING: "FUNDING",
};

const fundingCap = "9000000000000000000"; // 9 ETH

const TOKEN_SCALE = 1000;

const STATUS_MAP = ["FUNDING", "TRADING"];

let WETH: Contract;

describe("Crowdfund via Proxy from Factory", () => {
  let deployerWallet;
  let contributor;
  let secondContributor;
  let creatorWallet;
  let bidderWallet;
  let fakeMediaContract;
  let mediaAddress;

  before(async () => {
    [
      deployerWallet,
      contributor,
      secondContributor,
      creatorWallet,
      bidderWallet,
      fakeMediaContract,
    ] = await ethers.getSigners();

    mediaAddress = fakeMediaContract.address;

    const WETHFactory = await ethers.getContractFactory("WETH");
    WETH = await (await WETHFactory.deploy()).deployed();
  });

  describe("the crowdfund logic is deployed", () => {
    let logic, factory, proxy, callableProxy;

    describe("when deployed with appropriate arguments", () => {
      let crowdfund: CrowdfundLogic;

      before(async () => {
        const CrowdfundLogic = await ethers.getContractFactory(
          "CrowdfundLogic"
        );
        logic = await CrowdfundLogic.deploy();
        await logic.deployed();
      });

      describe("when the Crowdfund Factory is deployed", () => {
        beforeEach(async () => {
          const CrowdfundFactory = await ethers.getContractFactory(
            "CrowdfundFactory"
          );

          const deployment = await CrowdfundFactory.deploy(
            logic.address,
            mediaAddress,
            WETH.address
          );
          factory = await deployment.deployed();
        });

        it("has the correct references to other contracts", async () => {
          expect(await factory.logic()).to.eq(logic.address);
          expect(await factory.wethAddress()).to.eq(WETH.address);
          expect(await factory.mediaAddress()).to.eq(mediaAddress);
        });

        describe("and a proxy is created through the factory", () => {
          let deploymentEvent;

          beforeEach(async () => {
            const operatorEquity = 5;
            const deployTx = await factory
              // .connect(creatorWallet)
              .createCrowdfund(
                name,
                symbol,
                creatorWallet.address,
                BigNumber.from(fundingCap),
                BigNumber.from(operatorEquity)
              );
            const receipt = await deployTx.wait();
            const { gasUsed } = receipt;

            deploymentEvent = factory.interface.parseLog(receipt.events[0]);

            // Compute address.
            const constructorArgs = ethers.utils.defaultAbiCoder.encode(
              ["string", "string", "address"],
              [name, symbol, creatorWallet.address]
            );
            const salt = ethers.utils.keccak256(constructorArgs);
            const proxyBytecode = (
              await ethers.getContractFactory("CrowdfundProxy")
            ).bytecode;
            const codeHash = ethers.utils.keccak256(proxyBytecode);
            const proxyAddress = await ethers.utils.getCreate2Address(
              factory.address,
              salt,
              codeHash
            );

            proxy = await (
              await ethers.getContractAt("CrowdfundProxy", proxyAddress)
            ).deployed();

            callableProxy = await (
              await ethers.getContractAt("CrowdfundLogic", proxyAddress)
            ).deployed();
          });

          it("creates an event log for the deployment", async () => {
            const eventData = deploymentEvent.args;
            expect(eventData.crowdfundProxy).to.eq(proxy.address);
            expect(eventData.name).to.eq(name);
            expect(eventData.symbol).to.eq(symbol);
            expect(eventData.operator).to.eq(creatorWallet.address);
          });

          it("deletes parameters used during deployment", async () => {
            const {
              name,
              symbol,
              operator,
              fundingCap,
              operatorPercent,
            } = await factory.parameters();

            expect(name).to.eq("");
            expect(symbol).to.eq("");
            expect(operator).to.eq(
              "0x0000000000000000000000000000000000000000"
            );
            expect(fundingCap.toString()).to.eq("0");
            expect(operatorPercent.toString()).to.eq("0");
          });

          it("it deploys a proxy with the correct data", async () => {
            expect(await proxy.logic()).to.eq(logic.address);
            // expect(await callableProxy.name()).to.eq(name);
            // expect(await callableProxy.symbol()).to.eq(symbol);
            // expect(await callableProxy.operator()).to.eq(creatorWallet.address);
            // expect(await callableProxy.operatorPercent()).to.eq("5");
          });

          describe("when a contributor attempts to contribute 2 ETH", () => {
            let originalBalance;
            let fundingAmount = "2000000000000000000"; // 2 ETH in wei
            let tx;
            let receipt;
            let gasUsed: BigNumber;
            let gasPrice: BigNumber;

            beforeEach(async () => {
              originalBalance = await waffle.provider.getBalance(contributor.address);
              tx = await callableProxy.contribute(
                // contributor.address,
                // fundingAmount,
                {
                  value: fundingAmount,
                }
              );
              receipt = await tx.wait();
              console.log({ receipt });
              gasUsed = receipt.gasUsed;
              gasPrice = tx.gasPrice;
            });
            it("uses 70889 gas", () => {
              expect(gasUsed.toString()).to.eq("70889");
            });
            it("increases the contract's balance by 2 ETH", async () => {
              console.log({ receipt });
              console.log({ tx });
              console.log({ v: tx.value.toString() });
              console.log({ p: proxy.address });
              const contractBalance = await waffle.provider.getBalance(
                proxy.address
              );
              console.log({ v: tx.value.toString() });
              console.log({ b: contractBalance.toString() });
              expect(contractBalance.toString()).to.eq(fundingAmount);
            });
          });
        });
      });
    });
  });
});
