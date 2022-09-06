async function deployContract(contractName, constructorParameters,user) {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(constructorParameters);
    await contract.deployed();
    console.log(`${contractName} contract deployed to: ${contract.address}`);
    return contract
}

async function deployProxyContract(contractName, initializerName, initializerParameters) {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await upgrades.deployProxy(
        Contract,
        initializerParameters,
        {
        initializer: initializerName,
        }
    );
    await contract.deployed();
    let contractAddress = contract.address;
    console.log(`${contractName} contract deployed to: ${contractAddress}`);
    return contract
}

async function upgradeContract(contractName, contractAddress) {
    const Contract = await ethers.getContractFactory(contractName);
    await upgrades.upgradeProxy(
      contractAddress,
      Contract
    );
    console.log(`${contractName} contract upgraded`);
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
    console.log(`Verification of ${contractName} at address ${contractAddress} completed!`);
}

const delay = ms => new Promise(res => setTimeout(res, ms));
module.exports = {
    delay,
    deployContract,
    deployProxyContract,
    upgradeContract,
    verifyContract
};