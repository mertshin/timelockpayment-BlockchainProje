const hre = require("hardhat");

async function main() {
  const unlockTime = Math.floor(Date.now() / 1000) + 60; // Þu andan 1 dakika sonrasý

  const TimeLockedWallet = await hre.ethers.getContractFactory("TimeLockedWallet");
  const timeLockedWallet = await TimeLockedWallet.deploy(unlockTime, {
    value: hre.ethers.parseEther("1.0") // 1 ETH gönderiyoruz sözleþmeye
  });

  await timeLockedWallet.waitForDeployment();

  console.log(`Deployed to: ${timeLockedWallet.target}`);
  console.log(`Unlock time (unix): ${unlockTime}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
