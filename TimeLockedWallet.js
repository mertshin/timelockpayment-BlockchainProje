const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLockedWallet", function () {
  let wallet, unlockTime, lockedAmount, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Þu andan 1 dakika sonrasý için kilit süresi
    unlockTime = Math.floor(Date.now() / 1000) + 60;
    lockedAmount = ethers.parseEther("1");

    const Wallet = await ethers.getContractFactory("TimeLockedWallet");
    wallet = await Wallet.deploy(unlockTime, { value: lockedAmount });
    await wallet.waitForDeployment();
  });

  it("Baþlangýçta doðru miktarda ETH kilitlenmiþ olmalý", async function () {
    const balance = await ethers.provider.getBalance(wallet.target);
    expect(balance).to.equal(lockedAmount);
  });

  it("Süre dolmadan para çekilememeli", async function () {
    await expect(wallet.withdraw()).to.be.revertedWith("You can't withdraw yet!");
  });

  it("Süre dolunca para çekilmeli", async function () {
    // Zamaný ileri al
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    // Çekim baþarýlý olmalý
    await expect(wallet.withdraw()).to.changeEtherBalances(
      [wallet, owner],
      [-lockedAmount, lockedAmount]
    );
  });
});
