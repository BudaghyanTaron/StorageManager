// const hre = require("hardhat");
const deployer = require("../utils/contract-deployment.js")

const slotManag = "SlotManager"

async function main() {
    const [owner] = await ethers.getSigners();
    await deployer.deployContract(slotManag,[])
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
