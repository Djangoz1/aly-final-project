const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// *::::::::::::: ------------- :::::::::::::* //
// *::::::::::::: WORK PROPOSAL :::::::::::::* //
// *::::::::::::: ------------- :::::::::::::* //

const PUB_DATAS_URI_EXEMPLE = {
  id: 0,
  title: "Title of my post",
  description:
    "This is a part where content value stored. I can write everything I want to share at the community or missions community or private community.",
  image: "https://picsum.photos/id/100/200",
  name: "Mission #",
};

// *::::::::::::: ------- :::::::::::::* //
// *::::::::::::: MISSION :::::::::::::* //
// *::::::::::::: ------- :::::::::::::* //

const MISSION_DATAS_URI_EXEMPLE = {
  id: 0,
  title: "Title of my mission",
  description:
    "This is a part where content value stored. I can write everything I want to describe my mission. This description must provide a maximum of information about the mission. This is a kind of roadmap.",
  image: "https://picsum.photos/id/100/200",
  name: "Mission #",
  // Other mission id
  reference: null,
  // you can provide a link for more information about the mission like current website
  url: "https://currentwebsite.com/Djangoz1/aly-final-project",
};

// *::::::::::::: -------- :::::::::::::* //
// *::::::::::::: Features :::::::::::::* //
// *::::::::::::: -------- :::::::::::::* //

const FEATURE_DATAS_EXEMPLE = {
  missionID: 0,
  tokenURI: "uritoken",
  startedAt: 0,
  createdAt: 0,
  estimatedDays: 30,
  assignedWorker: ZERO_ADDRESS,
  status: 0,
  isInviteOnly: true,
  wadge: 0.02,
};

const FEATURE_DATAS_URI_EXEMPLE = {
  id: 0,
  title: "Dev blockchain",
  description:
    "This is a part where content value stored. I can write everything I want to describe my feature. Once a worker join this feature, I must follow instruction of this content. In the end, if a litigation arrived between owner(me) and worker, this content will be shared on Kleros Court",
  image: "https://picsum.photos/id/100/200",
  name: "Feature #",
  url: "https://github.com/Djangoz1/aly-final-project",
  devLanguage: "solidity",
  domain: "web3",
};

// *::::::::::::: ------------- :::::::::::::* //
// *::::::::::::: WORK PROPOSAL :::::::::::::* //
// *::::::::::::: ------------- :::::::::::::* //

const WORKER_PROPOSAL_DATAS_EXEMPLE = {
  id: 0,
  title: "Website creation",
  description:
    "This is a part where content value stored. I can write everything I want to describe my work.",
  // You can pass a link where the work stored
  url: "https://github.com/Djangoz1/aly-final-project",
};

// *::::::::::::: --------- :::::::::::::* //
// *::::::::::::: LAUNCHPAD :::::::::::::* //
// *::::::::::::: --------- :::::::::::::* //

const LAUNCHPAD_DATAS_EXEMPLE = {
  tokenAddress: ZERO_ADDRESS,
  name: "Launchpad 1",
  pubURI: "qsdqsqsdsqsqsq",
  numberOfTier: 3,
  maxCap: 1000000000,
  minCap: 10000000,
  saleStart: new Date().getTime(),
  saleEnd: new Date().getTime() + 1,
  totalUser: 0,
  communityVote: false,
};

module.exports = {
  _testParseHex,
  ZERO_ADDRESS,
  PUB_DATAS_URI_EXEMPLE,
  WORKER_PROPOSAL_DATAS_EXEMPLE,
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
};
