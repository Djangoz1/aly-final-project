// const { ethers } = require("hardhat");
// const { expect, assert } = require("chai");

// const {
//   _testInitFactoryCV,
//   _testInitCV,
//   _testInitMission,
//   _testInitMissionsHub,
//   _testInitAccessControl,
//   _testInitFeature,
//   _testInitFeaturesHub,
//   _testInitWorkerProposalHub,
//   _testInitWorkerProposal,
//   _testInitPubHub,
//   _testInitPub,
//   _testInitLaunchpad,
//   _testInitLaunchpadContracts,
// } = require("../../helpers/test_init");
// const {
//   PUB_DATAS_EXEMPLE,
//   FEATURE_DATAS_EXEMPLE,
// } = require("../../helpers/test_utils");

// const CONTRACT_NAME = "AccessControl";

// describe(`Contract ${CONTRACT_NAME} `, () => {
//   let accessControl;

//   beforeEach(async () => {
//     [
//       this.owner,
//       this.addr1,
//       this.addr2,
//       this.addr3,
//       this.addr4,
//       this.addr5,
//       this.addr6,
//       this.addr7,
//     ] = await ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]
//     accessControl = await _testInitAccessControl();
//   });

//   // *:::::::: -------------- ::::::::* //
//   // *:::::::: INITIALISATION ::::::::* //
//   // *:::::::: -------------- ::::::::* //

//   describe("Workflow : Initialization", () => {
//     it("Should deploy to Initialization workflow", async () => {
//       const workflow = await accessControl.workflow();
//       expect(parseInt(workflow)).to.equal(0);
//     });

//     it("factoryCV deployment should set his address", async () => {
//       let factoryCV = await _testInitFactoryCV(accessControl.target);
//       const _fAddress = await accessControl.iFCV();
//       expect(_fAddress).to.equal(factoryCV.target);
//     });

//     it("featuresHub deployment should set his address", async () => {
//       let featuresHub = await _testInitFeaturesHub(accessControl.target);
//       const _fAddress = await accessControl.iFH();
//       expect(_fAddress).to.equal(featuresHub.target);
//     });
//     it("workerProposalHub deployment should set his address", async () => {
//       let workerProposalHub = await _testInitWorkerProposalHub(
//         accessControl.target
//       );
//       const _wphAddress = await accessControl.iWPH();
//       expect(_wphAddress).to.equal(workerProposalHub.target);
//     });

//     it("factoryMission deployment should set his address", async () => {
//       // let factoryCV = await _testInitFactoryCV(accessControl.target);
//       let factoryMission = await _testInitMissionsHub(accessControl.target);
//       const _fMAddress = await accessControl.iMH();
//       expect(_fMAddress).to.equal(factoryMission.target);
//     });

//     it("pubHub deployment should set his address", async () => {
//       let pubHub = await _testInitPubHub(accessControl.target);
//       const pubHubAddr = await accessControl.iPH();
//       expect(pubHubAddr).to.equal(pubHub.target);
//     });

//     it("launchpad contracts deployment should set his address", async () => {
//       await _testInitLaunchpadContracts(
//         accessControl.target,
//         this.owner.address
//       );
//     });

//     it("Should not use onlyInit function", async () => {
//       await expect(
//         accessControl.getCVByAddress(this.addr1.address)
//       ).to.be.revertedWith("Init is not ready");
//     });

//     it("Should can use onlyInit function", async () => {
//       await _testInitFactoryCV(accessControl.target);
//       await _testInitMissionsHub(accessControl.target);
//       await _testInitPubHub(accessControl.target);
//       await _testInitFeaturesHub(accessControl.target);
//       await _testInitWorkerProposalHub(accessControl.target);
//       await _testInitLaunchpadContracts(
//         accessControl.target,
//         this.owner.address
//       );

//       expect(parseInt(await accessControl.workflow())).to.equal(1);
//     });
//   });

//   // *::::::::::::: ---- :::::::::::::* //
//   // *::::::::::::: INIT :::::::::::::* //
//   // *::::::::::::: ---- :::::::::::::* //

//   describe("Workflow : Init", () => {
//     let factoryMission;
//     let factoryCV;
//     let pubHub;
//     let featuresHub;
//     let workerProposalHub;
//     let launchpadContracts;
//     beforeEach(async () => {
//       factoryCV = await _testInitFactoryCV(accessControl.target);
//       factoryMission = await _testInitMissionsHub(accessControl.target);
//       featuresHub = await _testInitFeaturesHub(accessControl.target);
//       pubHub = await _testInitPubHub(accessControl.target);
//       workerProposalHub = await _testInitWorkerProposalHub(
//         accessControl.target
//       );
//       launchpadContracts = await _testInitLaunchpadContracts(
//         accessControl.target,
//         this.owner.address
//       );
//     });

//     it("Should deploy to Init workflow", async () => {
//       expect(parseInt(await accessControl.workflow())).to.equal(1);
//     });

//     it("Should not get CV", async () => {
//       await expect(
//         accessControl.getCVByAddress(this.addr1.address)
//       ).to.be.revertedWith("CV not found");
//     });

//     it("Should not get CV without proxy", async () => {
//       await expect(
//         factoryCV.getCVByAddress(this.addr2.address)
//       ).to.be.revertedWith("Must call function with proxy bindings");
//     });

//     it("Should buy CV", async () => {
//       expect(await _testInitCV(accessControl, this.addr1, 1)).to.not.be
//         .reverted;
//     });

//     it("Should not buy CV", async () => {
//       await expect(
//         _testInitCV(accessControl, this.addr1, 0)
//       ).to.be.revertedWith("Value must to be equal cv price");
//     });

//     // *::::::::::::: ------- :::::::::::::* //
//     // *::::::::::::: ELEMENT :::::::::::::* //
//     // *::::::::::::: ------- :::::::::::::* //

//     describe("Element Deployment", () => {
//       let cv;

//       beforeEach(async () => {
//         cv = await _testInitCV(accessControl, this.addr1, 1);
//         await _testInitCV(accessControl, this.owner, 1);
//         await _testInitCV(accessControl, this.addr2, 1);
//       });

//       it("Should  deploy Pub", async () => {
//         await _testInitPub(accessControl.target, this.addr1);
//       });

//       it("Should  deploy Mission", async () => {
//         await _testInitMission(accessControl.target, this.addr1, 0.2);
//       });

//       it("Should  deploy feature", async () => {
//         const missionId = await _testInitMission(
//           accessControl.target,
//           this.addr1,
//           0.2
//         );

//         await _testInitFeature(accessControl.target, this.addr1, missionId);
//       });
//       it("Should deploy workerProposal", async () => {
//         let price = parseInt(await accessControl.missionPrice());

//         const missionId = await _testInitMission(
//           accessControl.target,
//           this.addr2,
//           price
//         );
//         await _testInitFeature(accessControl.target, this.addr2, missionId);
//       });
//       it("Should deploy launchpad", async () => {
//         const launchpad = await _testInitLaunchpad(
//           accessControl.target,
//           this.owner
//         );
//       });
//     });
//   });
// });
