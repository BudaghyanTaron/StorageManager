/**
 * This test is broken.
 * @todo fix
 */

// Testing Scenario for parcels and miners
/**
    parcel Types
    0: standardParcel;
    1: businesParcel;
    nftTypes for standardParcel
    0: aestheticNFT
    1: minerNFT
    nftTypes for businesParcel
    0: Broker
    1: Factory
    2: Bank
    3: nftMarketplace
 */
// var web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
// var abiForBroker =[];
// var addressForBroker = "0x6DD85D1506032140292fFeeC108c98a106c71c5d";

// var brokerContract = new web3.eth.Contract(abiForBroker, addressForBroker);


// const managerAddress = "0xbbe44e37de382247d0d18332a376c17527b63d14";
// const otherAddress = ""
// // Tests connected with parcels
// // parcel minting function. x and y whole numbers like coordinates -999_ 999
// var resultForMintParcel;
// async function mintParcelCall(_x, _y, _type, _value) {
//     resultForMintParcel = await brokerContract.methods.mintParcel(_x, _y, _type).send({from: managerAddress, value: _value})
//     .then(console.log)
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }
// let rightValue;
// let wrongValue;
// // Test 1: Mint parcel and after it try to mint with same coordinates and type
//   await  mintParcelCall(0, 0, 0, rightValue);
//   await mintParcelCall(0, 0, 0, rightValue);
// // Test 2: Mint parcel and after it try to mint with same coordinates but with different type
// await mintParcelCall(0, 0, 1, rightValue);
// // Test 3: Mint parcel with wrong coordinates (range for x and y [-999,999])
// await mintParcelCall(-15, 15, 0, rightValue);
// await  mintParcelCall(1550, 12, 0, rightValue);
// await  mintParcelCall(12, -4654, 0, rightValue);
// // Test 4: Mint parcel with wrong type (type must be 0 or 1, 0 for standard parcel and 1 for business parcel)
// await  mintParcelCall(0, 1, 2, rightValue);
// // Test 5: Mint parcel with wrong money amount
// await   mintParcelCall(0, 2, 0, wrongValue);
// // Tests connected with parcel upgrading
// var resultForUpgradeStandardParcel;
// async function upgradeStandardParcelCall(_x, _y, _managerAddress, _value) {
//     resultForUpgradeStandardParcel = await brokerContract.methods.UpgradeStandardParcel(_x, _y).send({from: _managerAddress, value: _value})
//     .then(console.log)
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }
// // Test 1: Mint parcel and after it try to upgrade it ( there is parcelUpgraded event in StandardParcel contract )
// await mintParcelCall(50,50,0,rightValue);
// await upgradeStandardParcelCall(50,50, managerAddress, rightValue);
// // Test 2: Trying to upgrade parcel but calling that function from different address (not owner)
// await mintParcelCall(51,51,0,rightValue);
// await upgradeStandardParcelCall(51,51, otherAddress, rightValue);

// // Test 3: Trying to upgrade not existing parcel
// await upgradeStandardParcelCall(599,599, managerAddress, rightValue);

// // Test 4: Trying to upgrade upgraded parcel
// await upgradeStandardParcelCall(50,50, managerAddress, rightValue);

// // Tests connected with assigning NFTs to parcel ( 1 User must be able to assign 4 MinerNFTs to Standard parcel and 10 to Business parcel )
// var resultForAssignNFT;
// async function assignNFTCall(_x, _y, _sender, _nftType, _parcelType, _nftId) {
//     resultForAssignNFT = await brokerContract.methods.assignNFT(_x, _y, _nftType, _parcelType, _nftId).send({from: _sender})
//     .then(console.log)
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }
// // Test 0: Trying to assign nft
// const nftMinerId = 123456
// const nftAestheticId = 123456

// await assignNFTCall(50,50, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(50,50, managerAddress, 0, 0, nftAestheticId)

 
// // Test 1: Trying to assign nft to not existing parcel
// await assignNFTCall(600,50, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(500,50, managerAddress, 0, 0, nftAestheticId)

// // Test 2: Trying to assign not existing nft to existing parcel
// await assignNFTCall(600,50, managerAddress, 1, 0, 9999989)
// await assignNFTCall(500,50, managerAddress, 0, 0, 9999989)

// // Test 3: Trying to assign existing nft to existing parcel with right parameteres but with wrong address

// await assignNFTCall(600,50, otherAddress, 1, 0, nftMinerId)
// await assignNFTCall(500,50, otherAddress, 0, 0, nftAestheticId)
// // Test 4: Trying to assign with wrong coortdinates
// await assignNFTCall(60000,50, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(500,50000, managerAddress, 0, 0, nftAestheticId)
// // Test 5: Trying to assign more than 4 miners on Standard parcel
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// // Test 6: Assign 4 miners on Standard parcel after that upgrade it and try to assign other 6 miners
// upgradeStandardParcelCall(0,0, managerAddress, rightValue);
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// // Test 7: Trying to assign more than 10 miners on business parcel
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)
// await assignNFTCall(0,0, managerAddress, 1, 0, nftMinerId)


// // Test 8: Assign Miner to busines parcel
// await mintParcelCall(-5, -5, 1, rightValue);

// await assignNFTCall(-5, -5, managerAddress, 1, 1, nftMinerId)


// async function unAssignNFTCall(_x, _y, _sender, _nftType, _parcelType, _nftId){
//     resultForUnAssignNFT = await brokerContract.methods.unAssignNFT(_x, _y, _nftType, _parcelType, _nftId).send({from: _sender})
//     .then(console.log)
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }
// // Test 8: Unassign miner from Standard parcel (4) and try to assign it back same thing for business parcel (10)
