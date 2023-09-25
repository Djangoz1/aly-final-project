const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// *::::::::::::: ------------- :::::::::::::* //
// *::::::::::::: WORK PROPOSAL :::::::::::::* //
// *::::::::::::: ------------- :::::::::::::* //

const getAccount = (accounts, address) =>
  accounts.filter((el) => (el.address === address ? el : null));

const CV_DATAS_URI_EXEMPLE = {
  cv: "img/cv.jpeg",
  title: "Work3 CV",
  username: "Django",
  description: "CEO of deWork 🫅🏽",
  image: "img/profile.jpeg",
  attributes: [
    {
      visibility: true,
      cvImg: "stringURI",
      banniere: "",
      identity: {
        firstName: "Julien",
        lastName: "Djangone",
        phone: "07 83 91 30 31",
        email: "jg.djangone@gmail.com",
        dateOfBirth: "02/10/1997",
        citizen: "Mr",
      },
      social: {
        linkedin: null,
        facebook: null,
        twitter: null,
        github: null,
      },
      createdAt: Date.now(),
      skills: [2, 4, 8, 10],
      domain: 2,
      languages: [
        { langue: "Français", level: 3 },
        { langue: "Anglais", level: 2 },
      ],
    },
  ],
};
const PUB_DATAS_URI_EXEMPLE = {
  title: "Work3 Pub",
  description:
    "This is a part where content value stored. I can write everything I want to share at the community or missions community or private community.",
  image: "img/pub.jpeg",
  attributes: [{ createdAt: Date.now(), tags: [] }],
};

// *::::::::::::: ------- :::::::::::::* //
// *::::::::::::: MISSION :::::::::::::* //
// *::::::::::::: ------- :::::::::::::* //

const MISSION_DATAS_URI_EXEMPLE = {
  id: 0,
  title: "Work3 Mission",
  description:
    "This is a part where content value stored. I can write everything I want to describe my mission. This description must provide a maximum of information about the mission. This is a kind of roadmap.",
  image: "img/mission.png",
  name: "Mission #",
  // Other mission id

  attributes: {
    reference: null,
    facebook: null,
    evaluation: [],
    experience: 0,
    disponibilite: 0,
    createdAt: Date.now(),
    twitter: null,
    linkedin: null,
    github: null,
    domain: 4,
  },
  // you can provide a link for more information about the mission like current website
};

// *::::::::::::: -------- :::::::::::::* //
// *::::::::::::: Features :::::::::::::* //
// *::::::::::::: -------- :::::::::::::* //

const FEATURE_DATAS_EXEMPLE = {
  missionID: 0,
  specification: 3,
  estimatedDays: 30,
  wadge: 0.02,
  isInviteOnly: true,
};

const FEATURE_DATAS_URI_EXEMPLE = {
  title: "Dev blockchain",
  description:
    "This is a part where content value stored. I can write everything I want to describe my feature. Once a worker join this feature, I must follow instruction of this content. In the end, if a litigation arrived between owner(me) and worker, this content will be shared on Kleros Court",
  image: "https://picsum.photos/id/100/200",
  attributes: { domain: "web3" },
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
  numberOfTier: 3,
  maxCap: 1000000000,
  minCap: 10000000,
  minInvest: 300,
  maxInvest: ethers.parseEther("3"),
  saleStart: new Date().getTime(),
  saleEnd: new Date().getTime() + 1,
  lockedTime: 100000,
  totalUser: 0,
};

const TIER_DATAS_EXEMPLE = {
  maxTierCap: 10000000,
  minTierCap: 1000000,
  amountRaised: 0,
  tokenPrice: ethers.parseEther("0.1"),
  users: 0,
};

module.exports = {
  _testParseHex,
  ZERO_ADDRESS,
  getAccount,
  CV_DATAS_URI_EXEMPLE,
  PUB_DATAS_URI_EXEMPLE,
  WORKER_PROPOSAL_DATAS_EXEMPLE,
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  TIER_DATAS_EXEMPLE,
  LAUNCHPAD_DATAS_EXEMPLE,
};
