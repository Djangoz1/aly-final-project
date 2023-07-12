const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const PUB_DATAS_EXEMPLE = {
  title: "Title of my post",
  content:
    "This is a part where content value stored. I can write everything I want to share at the community or missions community or private community.",
  imgURI: "https://picsum.photos/id/100/200",
  publisher: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  followers: 0,
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
  estimatedDays: 0,
  assignedWorker: ZERO_ADDRESS,
  isInviteOnly: true,
  wadge: 0.2,
};

const FEATURE_DATAS_URI_EXEMPLE = {
  id: 0,
  title: "Title of my feature",
  description:
    "This is a part where content value stored. I can write everything I want to describe my feature. Once a worker join this feature, I must follow instruction of this content. In the end, if a litigation arrived between owner(me) and worker, this content will be shared on Kleros Court",
  image: "https://picsum.photos/id/100/200",
  name: "Feature #",
  devLanguage: "solidity",
};

const WORKER_PROPOSAL_DATAS_EXEMPLE = {
  id: 0,
  title: "Website creation",
  description:
    "This is a part where content value stored. I can write everything I want to describe my work.",
  // You can pass a link where the work stored
  url: "https://github.com/Djangoz1/aly-final-project",
};

module.exports = {
  _testParseHex,
  ZERO_ADDRESS,
  PUB_DATAS_EXEMPLE,
  WORKER_PROPOSAL_DATAS_EXEMPLE,
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
};
