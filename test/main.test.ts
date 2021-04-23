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
            expect(await callableProxy.name()).to.eq(name);
            expect(await callableProxy.symbol()).to.eq(symbol);
            expect(await callableProxy.operator()).to.eq(creatorWallet.address);
            expect(await callableProxy.operatorPercent()).to.eq("5");
          });

          describe("when a contributor attempts to contribute 2 ETH", () => {
            let originalBalance;
            let fundingAmount = "2000000000000000000"; // 2 ETH in wei
            let tx;
            let receipt;
            let gasUsed: BigNumber;
            let gasPrice: BigNumber;

            beforeEach(async () => {
              originalBalance = await waffle.provider.getBalance(
                contributor.address
              );
              tx = await callableProxy
                .connect(contributor)
                .contribute(contributor.address, fundingAmount, {
                  value: fundingAmount,
                });
              receipt = await tx.wait();
              gasUsed = receipt.gasUsed;
              gasPrice = tx.gasPrice;
            });

            it("uses 92442 gas", () => {
              expect(gasUsed.toString()).to.eq("92442");
            });

            it("increases the contract's balance by 2 ETH", async () => {
              const contractBalance = await waffle.provider.getBalance(
                proxy.address
              );
              expect(contractBalance.toString()).to.eq(fundingAmount);
            });

            it("decrease the contributor's ETH balance by 2 ETH plus gas for the tx", async () => {
              const ethUsedForTX = gasPrice.mul(gasUsed);
              const totalCost = ethUsedForTX.add(fundingAmount);
              const expectedBalance = originalBalance.sub(totalCost);
              const newBalance = await waffle.provider.getBalance(
                contributor.address
              );

              expect(newBalance.toString()).to.eq(expectedBalance.toString());
            });

            it("mints tokens for the contributor equal to the amount of ETH given, multiplied by the token scale factor", async () => {
              const tokenBalance = await callableProxy.balanceOf(
                contributor.address
              );
              const expectedBalance = BigNumber.from(fundingAmount).mul(
                TOKEN_SCALE
              );
              expect(tokenBalance.toString()).to.eq(expectedBalance);
            });

            it("grants them 2 ETH redeemable", async () => {
              const tokenBalance = await callableProxy.balanceOf(
                contributor.address
              );
              const redeemable = await callableProxy.redeemableFromTokens(
                tokenBalance
              );
              expect(redeemable.toString()).to.eq(fundingAmount);
            });

            it("emits a Transfer and Contribution event", async () => {
              const logs = await waffle.provider.getLogs({});

              expect(logs.length).eq(2);

              const transferEvent = callableProxy.interface.parseLog(logs[0]);
              const contributionEvent = callableProxy.interface.parseLog(
                logs[1]
              );

              expect(transferEvent.name).to.eq("Transfer");
              expect(contributionEvent.name).to.eq("Contribution");

              expect(contributionEvent.args[0]).to.eq(contributor.address);
              expect(contributionEvent.args[1].toString()).to.eq(fundingAmount);
            });

            describe("when the contributor attempts to redeem 1.2 ETH worth their contributions", () => {
              const withdrawAmount = "1200000000000000000"; // 1.2 ETH in wei
              const tokenAmount = BigNumber.from(withdrawAmount).mul(
                TOKEN_SCALE
              );
              const remainingETH = "800000000000000000";
              const remainingSupply = BigNumber.from(remainingETH).mul(
                TOKEN_SCALE
              );
              let originalTokenBalance;
              let originalETHBalance;
              let originalContractBalance;

              beforeEach(async () => {
                originalContractBalance = await waffle.provider.getBalance(
                  callableProxy.address
                );
                originalETHBalance = await waffle.provider.getBalance(
                  contributor.address
                );
                originalTokenBalance = await callableProxy
                  .connect(contributor)
                  .balanceOf(contributor.address);

                tx = await callableProxy
                  .connect(contributor)
                  .redeem(tokenAmount);

                receipt = await tx.wait();

                gasUsed = receipt.gasUsed;
                gasPrice = tx.gasPrice;
              });

              it(`burns their tokens, so that their token balance is ${remainingSupply.toString()}`, async () => {
                const newTokenBalance = await callableProxy
                  .connect(contributor)
                  .balanceOf(contributor.address);

                expect(newTokenBalance.toString()).to.eq(
                  remainingSupply.toString()
                );
              });

              it(`totalSupply() is now ${remainingSupply.toString()}`, async () => {
                const supply = await callableProxy.totalSupply();

                expect(supply.toString()).to.eq(remainingSupply.toString());
              });

              it("decreases the contract's balance by 1.2 ETH", async () => {
                const newContractBalance = await waffle.provider.getBalance(
                  callableProxy.address
                );

                expect(newContractBalance.toString()).to.eq(
                  BigNumber.from(originalContractBalance)
                    .sub(withdrawAmount)
                    .toString()
                );
              });

              it("increases the sender's balance by 1.2 ETH, minus gas", async () => {
                const newEthBalance = await waffle.provider.getBalance(
                  contributor.address
                );
                const ethUsedForTX = gasPrice.mul(gasUsed);
                const expectedBalance = originalETHBalance
                  .add(withdrawAmount)
                  .sub(ethUsedForTX);

                expect(newEthBalance.toString()).to.eq(
                  expectedBalance.toString()
                );
              });

              it("uses 50770 gas", () => {
                expect(gasUsed.toString()).to.eq("50770");
              });

              it("emits a Transfer and Withdrawal event", async () => {
                const logs = await waffle.provider.getLogs({});

                expect(logs.length).eq(2);

                const transferEvent = callableProxy.interface.parseLog(logs[0]);
                const redeemEvent = callableProxy.interface.parseLog(logs[1]);

                expect(transferEvent.name).to.eq("Transfer");
                expect(redeemEvent.name).to.eq("Redeemed");

                expect(redeemEvent.args[0]).to.eq(contributor.address);
                expect(redeemEvent.args[1].toString()).to.eq(withdrawAmount);
              });

              describe("when another contributor adds 3.3 ETH", () => {
                let originalBalance;
                let fundingAmount = "3300000000000000000"; // 2 ETH in wei
                let tokenAmount = BigNumber.from(fundingAmount).mul(
                  TOKEN_SCALE
                );
                let expectedSupply = BigNumber.from("4100000000000000000").mul(
                  TOKEN_SCALE
                );
                let tx;
                let receipt;
                let gasUsed: BigNumber;
                let gasPrice: BigNumber;

                beforeEach(async () => {
                  originalBalance = await waffle.provider.getBalance(
                    secondContributor.address
                  );

                  tx = await callableProxy
                    .connect(secondContributor)
                    .contribute(secondContributor.address, fundingAmount, {
                      value: fundingAmount,
                    });
                  receipt = await tx.wait();

                  gasUsed = receipt.gasUsed;
                  gasPrice = tx.gasPrice;
                });

                it("uses 58230 gas", () => {
                  expect(gasUsed.toString()).to.eq("58230");
                });

                it("increases the contract's balance by 3.3 ETH", async () => {
                  const contractBalance = await waffle.provider.getBalance(
                    callableProxy.address
                  );
                  expect(contractBalance.toString()).to.eq(
                    BigNumber.from("800000000000000000")
                      .add(fundingAmount)
                      .toString()
                  );
                });

                it("decrease the contributor's ETH balance by 3.3 ETH plus gas for the tx", async () => {
                  const ethUsedForTX = gasPrice.mul(gasUsed);
                  const totalCost = ethUsedForTX.add(fundingAmount);
                  const expectedBalance = originalBalance.sub(totalCost);
                  const newBalance = await waffle.provider.getBalance(
                    secondContributor.address
                  );

                  expect(newBalance.toString()).to.eq(
                    expectedBalance.toString()
                  );
                });

                it("mints tokens for the contributor equal to the amount of ETH given", async () => {
                  const tokenBalance = await callableProxy.balanceOf(
                    secondContributor.address
                  );
                  expect(tokenBalance.toString()).to.eq(tokenAmount.toString());
                });

                it("grants them 3.3 ETH redeemable", async () => {
                  const tokenBalance = await callableProxy.balanceOf(
                    secondContributor.address
                  );
                  const redeemable = await callableProxy.redeemableFromTokens(
                    tokenBalance
                  );
                  expect(redeemable.toString()).to.eq(fundingAmount);
                });

                it("emits a Transfer and Contribution event", async () => {
                  const logs = await waffle.provider.getLogs({});

                  expect(logs.length).eq(2);

                  const transferEvent = callableProxy.interface.parseLog(
                    logs[0]
                  );
                  const contributionEvent = callableProxy.interface.parseLog(
                    logs[1]
                  );

                  expect(transferEvent.name).to.eq("Transfer");
                  expect(contributionEvent.name).to.eq("Contribution");

                  expect(contributionEvent.args[0]).to.eq(
                    secondContributor.address
                  );
                  expect(contributionEvent.args[1].toString()).to.eq(
                    fundingAmount
                  );
                });

                it(`totalSupply() is now ${expectedSupply.toString()}`, async () => {
                  const supply = await callableProxy.totalSupply();

                  expect(supply.toString()).to.eq(expectedSupply.toString());
                });

                describe("when the contributor attempts to withdraw 4 ETH worth from the contract", () => {
                  let tokenAmount = BigNumber.from("4000000000000000000").mul(
                    TOKEN_SCALE
                  );

                  it("reverts the transaction", async () => {
                    await expect(
                      callableProxy
                        .connect(secondContributor)
                        .redeem(tokenAmount)
                    ).to.be.revertedWith("Insufficient balance");
                  });
                });

                describe("when the contributor attempts to withdraw .2 ETH from their contributions", () => {
                  const withdrawAmount = "200000000000000000"; // 0.2 ETH in wei
                  const tokenAmount = BigNumber.from(withdrawAmount).mul(
                    TOKEN_SCALE
                  );
                  const remainingBalance = BigNumber.from(
                    "3100000000000000000"
                  ).mul(TOKEN_SCALE);
                  const expectedSupply = BigNumber.from(
                    "3900000000000000000"
                  ).mul(TOKEN_SCALE);
                  let originalTokenBalance;
                  let originalETHBalance;
                  let originalContractBalance;

                  beforeEach(async () => {
                    originalContractBalance = await waffle.provider.getBalance(
                      callableProxy.address
                    );
                    originalETHBalance = await waffle.provider.getBalance(
                      secondContributor.address
                    );
                    originalTokenBalance = await callableProxy
                      .connect(secondContributor)
                      .balanceOf(secondContributor.address);

                    tx = await callableProxy
                      .connect(secondContributor)
                      .redeem(tokenAmount);

                    receipt = await tx.wait();

                    gasUsed = receipt.gasUsed;
                    gasPrice = tx.gasPrice;
                  });

                  it(`burns their tokens, so that their token balance is ${remainingBalance.toString()}`, async () => {
                    const newTokenBalance = await callableProxy
                      .connect(secondContributor)
                      .balanceOf(secondContributor.address);

                    expect(newTokenBalance.toString()).to.eq(
                      remainingBalance.toString()
                    );
                  });

                  it("decreases the contract's balance by 0.2 ETH", async () => {
                    const newContractBalance = await waffle.provider.getBalance(
                      callableProxy.address
                    );

                    expect(newContractBalance.toString()).to.eq(
                      BigNumber.from(originalContractBalance)
                        .sub(withdrawAmount)
                        .toString()
                    );
                  });

                  it("increases the sender's balance by 0.2 ETH, minus gas", async () => {
                    const newEthBalance = await waffle.provider.getBalance(
                      secondContributor.address
                    );
                    const ethUsedForTX = gasPrice.mul(gasUsed);
                    const expectedBalance = originalETHBalance
                      .add(withdrawAmount)
                      .sub(ethUsedForTX);

                    expect(newEthBalance.toString()).to.eq(
                      expectedBalance.toString()
                    );
                  });

                  it("uses 50770 gas", () => {
                    expect(gasUsed.toString()).to.eq("50770");
                  });

                  it("emits a Transfer and Withdrawal event", async () => {
                    const logs = await waffle.provider.getLogs({});

                    expect(logs.length).eq(2);

                    const transferEvent = callableProxy.interface.parseLog(
                      logs[0]
                    );
                    const redeemEvent = callableProxy.interface.parseLog(
                      logs[1]
                    );

                    expect(transferEvent.name).to.eq("Transfer");
                    expect(redeemEvent.name).to.eq("Redeemed");

                    expect(redeemEvent.args[0]).to.eq(
                      secondContributor.address
                    );
                    expect(redeemEvent.args[1].toString()).to.eq(
                      withdrawAmount
                    );
                  });

                  it(`totalSupply() is now ${expectedSupply.toString()}`, async () => {
                    const supply = await callableProxy.totalSupply();
                    expect(supply.toString()).to.eq(expectedSupply.toString());
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
