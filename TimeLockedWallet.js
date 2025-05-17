const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLockedWallet", function () {
  let wallet, unlockTime, lockedAmount, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // �u andan 1 dakika sonras� i�in kilit s�resi
    unlockTime = Math.floor(Date.now() / 1000) + 60;
    lockedAmount = ethers.parseEther("1");

    const Wallet = await ethers.getContractFactory("TimeLockedWallet");
    wallet = await Wallet.deploy(unlockTime, { value: lockedAmount });
    await wallet.waitForDeployment();
  });

  it("Ba�lang��ta do�ru miktarda ETH kilitlenmi� olmal�", async function () {
    const balance = await ethers.provider.getBalance(wallet.target);
    expect(balance).to.equal(lockedAmount);
  });

  it("S�re dolmadan para �ekilememeli", async function () {
    await expect(wallet.withdraw()).to.be.revertedWith("You can't withdraw yet!");
  });

  it("S�re dolunca para �ekilmeli", async function () {
    // Zaman� ileri al
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    // �ekim ba�ar�l� olmal�
    await expect(wallet.withdraw()).to.changeEtherBalances(
      [wallet, owner],
      [-lockedAmount, lockedAmount]
    );
  });
});
