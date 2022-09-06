const { ethers, upgrades } = require("hardhat");
const { delay } = require("../utils/contract-deployment.js")

const proxyContract = "Proxy"


async function main() {
    const [owner] = await ethers.getSigners();
    
    console.log("Deploying from ", owner.address);
    
    // Municipality Contract Deployment
   await deployAndVerifyProxyContract(proxyContract)
    
}

async function deployAndVerifyProxyContract(contractName) {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await upgrades.deployProxy(
        Contract,
        [
            1,
            2,
            3,
            4,
            5,
            6
        ],
        {
        initializer: "initialize",
        }
    );
    await contract.deployed();
    let contractAddress = contract.address;
    console.log(`${contractName} contract deployed to: ${contractAddress}`);

    console.log(`Starting verification of the implementation`)
    await delay(10000);

    let implementationAddress = await upgrades.erc1967.getImplementationAddress(contractAddress); 
    
    verifyContract(contractName, implementationAddress)

    console.log(`\nDeployment and verification of ${contractName} completed!`);
    console.log(`${contractName} Address: ${contractAddress}`);
    console.log(`Implementation Address: ${implementationAddress} \n\n`);

    return contract
}

async function verifyContract(contractName, contractAddress) {
    try{
        await run("verify:verify", { address: contractAddress});
    } catch(error) {
        if(!error.message.toLowerCase().includes("already verified")) {
            console.error(error);
            console.log(`\nVerification of ${contractName} failed!`);
            console.log(`But ${contractName} contract was deployed at Address: ${contractName}`);
            process.exit(1);
        }
    };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

