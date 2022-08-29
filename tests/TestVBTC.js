const { expect } = require("chai");
const { ethers } = require("hardhat");

const vbtcContractName = "VBTC";

describe(`${vbtcContractName} contract`, function () {
  var tokenContract;
  var testUsers;
  var managementAccount;
  var taxCollectorAccount;

  it(`should deploy ${vbtcContractName} contract and pre-mint tokens`, async function () {
    testUsers = await ethers.getSigners();

    const preMintAccount = testUsers[1];
    const preMintAmount = ethers.utils.parseEther("42640099");

    managementAccount = testUsers[2];
    taxCollectorAccount = testUsers[3];

    const tokenFactory = await ethers.getContractFactory(vbtcContractName);
    tokenContract = await tokenFactory.deploy();

    expect(await tokenContract.deployed());
    expect(await tokenContract.initialize(
      managementAccount.address,
      taxCollectorAccount.address,
      preMintAccount.address,
      preMintAmount
    ));

    expect(await tokenContract.balanceOf(preMintAccount.address)).to.equal(preMintAmount);
  });

  it('should restrict calling updateDexAddress to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).updateDexAddress(ethers.constants.AddressZero, true))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling updateTaxExcemptAddress to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).updateTaxExcemptAddress(ethers.constants.AddressZero, true))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling updateTaxCollector to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).updateTaxCollector(ethers.constants.AddressZero))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling manageBlacklist to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).manageBlacklist([], []))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling mintFor to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).mintFor(testUsers[10].address, 100))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling pauseTrading to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).pauseTrading(true))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling updateManagementAddress to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).updateManagementAddress(ethers.constants.AddressZero))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should restrict calling withdrawBnb to owner only', async function () {
    await expect(tokenContract.connect(testUsers[10]).withdrawBnb())
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it('should revert mint to zero address', async function () {
    await expect(tokenContract.mintFor(ethers.constants.AddressZero, 100))
      .to.be.revertedWith("VBTC: mint to the zero address");
  });

  it('should revert mint if amount exceeds MAX_SUPPLY', async function () {
    const maxSupply = await tokenContract.MAX_SUPPLY();

    await expect(tokenContract.mintFor(testUsers[0].address, maxSupply))
      .to.be.revertedWith("VBTC: mint amount exceeds max supply");
  });

  it('should mint tokens to wallet', async function () {
    const amount = ethers.utils.parseEther("1000");
    const holder = testUsers[6];

    await tokenContract.mintFor(holder.address, amount);
    expect(await tokenContract.balanceOf(holder.address)).to.be.equal(amount);
  });

  it('should burn tokens', async function () {
    const holder = testUsers[6];
    const amount = await tokenContract.balanceOf(holder.address);

    await tokenContract.connect(holder).burn(amount);

    expect(await tokenContract.balanceOf(holder.address)).to.equal(0);
  });

  it('should revert burn with insufficient balance', async function () {
    await expect(tokenContract.connect(testUsers[6]).burn(ethers.utils.parseEther("10000")))
      .to.be.revertedWith("VBTC: burn amount exceeds balance");
  });

  it('should revert burnFrom for zero address', async function () {
    await expect(tokenContract.burnFrom(ethers.constants.AddressZero, 100))
      .to.be.revertedWith("VBTC: burn from the zero address");
  });

  it('should revert burnFrom with insufficient allowance', async function () {
    await expect(tokenContract.burnFrom(testUsers[6].address, 100))
      .to.be.revertedWith("VBTC: burn amount exceeds allowance");
  });

  it('should revert burnFrom with insufficient balance', async function () {
    const holder = testUsers[6];
    const burnAmount = ethers.utils.parseEther("1000");

    await tokenContract.connect(holder).approve(testUsers[0].address, burnAmount);

    await expect(tokenContract.burnFrom(testUsers[6].address, burnAmount))
      .to.be.revertedWith("VBTC: burn amount exceeds balance");
  });

  it('should burn tokens using burnFrom', async function () {
    const holder = testUsers[7];
    const amount = ethers.utils.parseEther("55");

    await tokenContract.mintFor(holder.address, amount);

    expect(await tokenContract.balanceOf(holder.address)).to.equal(amount);

    await tokenContract.connect(holder).approve(testUsers[0].address, amount);

    expect(await tokenContract.burnFrom(holder.address, amount));
    expect(await tokenContract.balanceOf(holder.address)).to.equal(0);
  });

  it('should revert transfer to zero address', async function () {
    await expect(tokenContract.transfer(ethers.constants.AddressZero, 1000))
      .to.be.revertedWith("VBTC: to address is not valid");
  });

  it('should revert transfer with insufficient balance', async function () {
    await expect(tokenContract.transfer(testUsers[5].address, 1000))
      .to.be.revertedWith("VBTC: insufficient balance");
  });

  it('should revert transfers for blacklisted wallet', async function () {
    const blacklistedWallet = testUsers[9];

    await tokenContract.manageBlacklist([blacklistedWallet.address], [true]);

    await expect(tokenContract.connect(blacklistedWallet).transfer(testUsers[1].address, 1000))
      .to.be.revertedWith("VBTC: cannot transfer to/from blacklisted account");

    await expect(tokenContract.transfer(blacklistedWallet.address, 1000))
      .to.be.revertedWith("VBTC: cannot transfer to/from blacklisted account");

    await tokenContract.manageBlacklist([blacklistedWallet.address], [false]);
  });

  it('should transfer tokens', async function() {
    const wallet = testUsers[9];
    const amount = ethers.utils.parseEther('100');
    const receiver = testUsers[10];

    await tokenContract.mintFor(wallet.address, amount);
    await tokenContract.connect(wallet).transfer(receiver.address, amount);

    expect(await tokenContract.balanceOf(wallet.address)).to.equal(0);
    expect(await tokenContract.balanceOf(receiver.address)).to.equal(amount);    
  });

  it('should revert dex transfers when trading is puased', async function() {
    const dexAddress = testUsers[13].address;
    const wallet = testUsers[9];
    const amount = ethers.utils.parseEther('100');

    await tokenContract.updateDexAddress(dexAddress, true);

    await tokenContract.mintFor(wallet.address, amount);
    await expect(tokenContract.connect(wallet).transfer(dexAddress, amount))
      .to.be.revertedWith("VBTC: only liq transfer allowed");
  });

  it('should take fees on transfer for token sell', async function() {
    const dexAddress = testUsers[13].address;
    const wallet = testUsers[9];
    const amount = ethers.utils.parseEther('100');

    const devFundTax = await tokenContract.devFundTax();
    const sellTokenTax = await tokenContract.taxOnSell();

    await tokenContract.pauseTrading(false);
    await tokenContract.updateDexAddress(dexAddress, true);

    await tokenContract.mintFor(wallet.address, amount);
    await tokenContract.connect(wallet).transfer(dexAddress, amount);

    const devFundTaxAmount = amount.mul(devFundTax).div(100);
    const sellTokenTaxAmount = amount.mul(sellTokenTax).div(100);

    expect(await tokenContract.balanceOf(managementAccount.address)).to.equal(devFundTaxAmount);
    expect(await tokenContract.balanceOf(taxCollectorAccount.address)).to.equal(sellTokenTaxAmount);
    expect(await tokenContract.balanceOf(dexAddress))
      .to.equal(amount.sub(devFundTaxAmount).sub(sellTokenTaxAmount));
  });

  it('should revert transferFrom with insufficient allowance', async function() {
    await expect(tokenContract.transferFrom(testUsers[1].address, testUsers[2].address, 100))
      .to.be.revertedWith("VBTC: insufficient allowance");
  });

  it('should revert transferFrom to zero address', async function() {
    const owner = testUsers[5];
    const spender = testUsers[1];

    await tokenContract.connect(owner).approve(spender.address, 100);

    await expect(tokenContract.connect(spender).transferFrom(owner.address, ethers.constants.AddressZero, 100))
      .to.be.revertedWith("VBTC: to address is not valid");
  });

  it('should transfer ownership', async function () {
    const newOwner = testUsers[15];

    await tokenContract.transferOwnership(newOwner.address);

    expect(await tokenContract.owner()).to.be.equal(newOwner.address);
  });
});
