const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

const {
  _testInitFactoryCV,
  _testInitCV,
  _testInitMission,
  _testInitMissionsHub,
  _testInitAccessControl,
  _testInitFeature,
  _testInitFeaturesHub,
  _testInitWorkerProposalHub,
  _testInitWorkerProposal,
  _testInitPubHub,
  _testInitPub,
  _testInitLaunchpad,
  _testInitLaunchpadContracts,
  _testInitToken,
} = require("../../helpers/test_init");
const {
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
  TIER_DATAS_EXEMPLE,
} = require("../../helpers/test_utils");

const CONTRACT_NAME = "Launchpad";

describe(`Contract ${CONTRACT_NAME} `, () => {
  let accessControl;
  let lHub;
  let cLI;
  let LC;
  let cLD;

  beforeEach(async () => {
    [
      this.owner,
      this.addr1,
      this.addr2,
      this.addr3,
      this.addr4,
      this.addr5,
      this.addr6,
      this.addr7,
    ] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
    accessControl = await _testInitAccessControl();
    await _testInitFactoryCV(accessControl.target);
    await _testInitMissionsHub(accessControl.target);
    await _testInitPubHub(accessControl.target);
    await _testInitFeaturesHub(accessControl.target);
    await _testInitWorkerProposalHub(accessControl.target);
    const contracts = await _testInitLaunchpadContracts(
      accessControl.target,
      this.owner.address
    );
    await _testInitCV(accessControl.target, this.owner, 0.5);
    await _testInitCV(accessControl.target, this.addr1, 0.5);
    await _testInitCV(accessControl.target, this.addr2, 0.5);
    lHub = contracts.hub;
    cLI = contracts.investors;
    LC = contracts.cohort;
    cLD = contracts.datas;
  });

  describe("Init : Launchpad", () => {
    let token;
    let owner;
    let datas;
    let launchpad;
    let _lDatas;
    let _tDatas;

    beforeEach(async () => {
      owner = await this.addr1;
      const supply = 2000000000;
      token = await _testInitToken(this.owner, "Django", "DJN", supply);
      await token.transfer(owner.address, supply);
      expect(await token.balanceOf(this.owner.address)).to.be.equal(0);
      expect(await token.balanceOf(owner.address)).to.be.equal(supply);

      datas = LAUNCHPAD_DATAS_EXEMPLE;

      const currentDate = new Date();
      const futureDate = new Date(
        currentDate.getTime() + 20 * 24 * 60 * 60 * 1000
      );
      const amount = parseInt(await accessControl.launchpadPrice());
      const startDate = new Date(currentDate.getTime());
      datas.saleEnd = futureDate.getTime();
      datas.saleStart = startDate.getTime();
      _tDatas = [TIER_DATAS_EXEMPLE, TIER_DATAS_EXEMPLE];

      launchpad = await _testInitLaunchpad(
        accessControl.target,
        owner,
        token,
        amount,
        datas,
        _tDatas
      );
      _lDatas = await launchpad.getDatas();
    });

    it("Should  have good owner  ", async () => {
      expect(await launchpad.owner()).to.be.equal(owner.address);
    });

    it("Should  have true date datas  ", async () => {
      expect(_lDatas.saleStart).to.be.equal(datas.saleStart);
      expect(_lDatas.saleEnd).to.be.equal(datas.saleEnd);
    });

    it("Should  have true pubURI", async () => {
      expect(_lDatas.pubURI).to.be.equal(datas.pubURI);
    });

    it("Should  have true capitalization", async () => {
      let _maxCap = 0;
      let _minCap = 0;
      for (let index = 0; index < _tDatas.length; index++) {
        const element = _tDatas[index];
        _maxCap += element.maxTierCap;
        _minCap += element.minTierCap;
      }
      expect(_lDatas.maxCap).to.be.equal(_maxCap);
      expect(_lDatas.minCap).to.be.equal(_minCap);
    });

    it("Should  have true invest datas", async () => {
      expect(_lDatas.minInvest).to.be.equal(datas.minInvest);
      expect(_lDatas.maxInvest).to.be.equal(datas.maxInvest);
    });

    it("Should  have true lockedTime", async () => {
      expect(_lDatas.lockedTime).to.be.equal(datas.lockedTime);
    });

    it("Should  have 0 total user", async () => {
      expect(_lDatas.totalUser).to.be.equal(0);
    });

    it("Should  have true number of tier", async () => {
      expect(_lDatas.numberOfTier).to.be.equal(_tDatas.length);
    });

    it("Should  have true token address", async () => {
      expect(_lDatas.tokenAddress).to.be.equal(token.target);
    });
    it("Should  can lock token", async () => {
      const tokens = 100000000;
      expect(await token.balanceOf(this.owner.address)).to.be.equal(0);
      await token.connect(owner).approve(launchpad.target, tokens);
      expect(
        await token.connect(owner).allowance(owner.address, launchpad.target)
      ).to.be.equal(tokens);
      await launchpad.connect(owner).lockTokens(tokens);
      const royalties = tokens / 100;
      const afterRoyalties = tokens - royalties;
      expect(
        await token.allowance(owner.address, launchpad.target)
      ).to.be.equal(afterRoyalties);
      expect(await token.balanceOf(LC.owner())).to.be.equal(royalties);
    });

    describe("Launchpad : Buy test", () => {
      const txValue = ethers.parseEther("1");
      beforeEach(async () => {
        const tokens = 100000000;
        await token.connect(owner).approve(launchpad.target, tokens);
        await launchpad.connect(owner).lockTokens(tokens);
      });
      it("Should  can buy token", async () => {
        await launchpad.connect(this.addr2).buyTokens({ value: txValue });
        let investorData = await cLI.getInvestorData(
          await launchpad.id(),
          this.addr2
        );
        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          investorData.lockedTokens
        );
        const tierData = await launchpad.getTierDatas(
          await launchpad.getCurrentTierID()
        );

        expect(investorData.tier.length).to.be.equal(1);
        expect(investorData.tier[0]).to.be.equal(
          await launchpad.getCurrentTierID()
        );
        let expectedTokens = txValue / tierData.tokenPrice;
        expect(investorData.investedAmount).to.be.equal(txValue);
        expect(investorData.lockedTokens).to.be.equal(expectedTokens);
        await launchpad.connect(this.addr2).buyTokens({ value: txValue });
        investorData = await cLI.getInvestorData(
          await launchpad.id(),
          this.addr2
        );
        expect(await token.balanceOf(launchpad.target)).to.be.equal(
          investorData.lockedTokens
        );
        expectedTokens = investorData.investedAmount / tierData.tokenPrice;
        expect(investorData.tier.length).to.be.equal(1);
        expect(investorData.investedAmount).to.be.equal(ethers.parseEther("2"));
        expect(investorData.lockedTokens).to.be.equal(expectedTokens);
      });
      it("Should  have true datas after buying", async () => {
        await launchpad.connect(this.addr2).buyTokens({ value: txValue });

        let datas = await launchpad.getDatas();
        let tierData = await launchpad.getTierDatas(
          await launchpad.getCurrentTierID()
        );

        expect(datas.totalUser).to.be.equal(1);
        expect(tierData.users).to.be.equal(1);
        expect(tierData.amountRaised).to.be.equal(txValue);

        await launchpad.connect(this.addr2).buyTokens({ value: txValue });
        tierData = await launchpad.getTierDatas(
          await launchpad.getCurrentTierID()
        );
        expect(datas.totalUser).to.be.equal(1);
        expect(tierData.users).to.be.equal(1);
        expect(tierData.amountRaised).to.be.equal(ethers.parseEther("2"));
      });
    });
  });
});
