// const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

const PROXY = "0xd948941cAEffD79E8847063307d59BC380070F42";

async function main() {
    const [owner] = await ethers.getSigners();
    // We get the contract to deploy
    console.log(`Deploying from ${owner.address}`);
    const Contract = await ethers.getContractFactory("ProxyContract");
    await upgrades.upgradeProxy(
      PROXY,
      Contract
    );
    console.log(`MinerNFT contract upgraded`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
