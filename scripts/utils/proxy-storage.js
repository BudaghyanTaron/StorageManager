const { ethers, upgrades } = require("hardhat");
const deployer = require("../utils/contract-deployment.js")

const slotManag = "SlotManager"
const proxyAdmin = "IProxyAdmin"

const SupportedOperations = {
	addVaribale: 0,
	RemoveVariable: 1
}

const contractName = "Proxy"                                         // Name of the contract where slots will be changed
const contractAddress = "0x7EdfC81bB85a3567092EBF1da5E9116154C7683A" // Address of the contract where slots will be changed
const slotNumber = 3                                                 // Number of the slot that will be changed
const lastSlotNumber = 6                                             // Number of the last slot on current contract
const unmovableSlots = []                                            // Slots that can not be moved
const operationType = SupportedOperations.RemoveVariable                // Operation that will be done to the proxy contract

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Deploying from ${owner.address}`);

    const slotManager = await deployer.deployContract(slotManag,[])

    const newImplementation = await deployer.deployContract(contractName,[])

    const adminAddress = await upgrades.erc1967.getAdminAddress(contractAddress)

    const adminContract = await ethers.getContractAt(proxyAdmin, adminAddress);

    await adminContract.upgrade(contractAddress, slotManager.address)

    let implementationAddress
    do {
        implementationAddress = await upgrades.erc1967.getImplementationAddress(contractAddress); 
    } while(implementationAddress != slotManager.address)

    const porxyContract = await ethers.getContractAt(slotManag, contractAddress);

    if(unmovableSlots.length > 0) {
        await addUnmovableSlots(porxyContract);
    }

    switch(operationType) {
        case SupportedOperations.addVaribale:
            await addVariableInProxy(porxyContract);
        break;
        case SupportedOperations.RemoveVariable:
            await removeVariableFromProxy(porxyContract);
        break;
        default:
            console.log("Operation not supported")
    }

    await adminContract.upgrade(contractAddress, newImplementation.address)

    await deployer.verifyContract(contractName, newImplementation.address)

}

async function addUnmovableSlots(contract) {
    for(let i = 0; i < unmovableSlots.length; i++){
        await contract.updateSlotMovability(unmovableSlots[i], true)
    }
}

async function addVariableInProxy(contract) {
    await contract.addVaribaleAtSlot(slotNumber, lastSlotNumber)
}

async function removeVariableFromProxy(contract) {
    await contract.removeVariableAtSlot(slotNumber, lastSlotNumber)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });