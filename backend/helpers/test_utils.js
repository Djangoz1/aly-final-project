const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// *::::::::::::: ------------- :::::::::::::* //
// *::::::::::::: WORK PROPOSAL :::::::::::::* //
// *::::::::::::: ------------- :::::::::::::* //

let transactionCost = async (tx) => {
  const txReceipt = await ethers.provider.getTransactionReceipt(tx);

  const gasUsed = txReceipt.gasUsed;
  console.log(gasUsed);
  return gasUsed;
};

const getAccount = (accounts, address) =>
  accounts.filter((el) => (el.address === address ? el : null));

const CV_DATAS_URI_EXEMPLE = {
  // cvImg: "img/cv.jpeg",
  username: "Django",
  description: "CEO of deWork 🫅🏽",
  // banniere: "img/banniere.png",
  // avatar: "img/profile.jpeg",
  email: "jg.djangone@gmail.com",
  visibility: "true",

  // banniere: null,
  identity: JSON.stringify(
    {
      firstName: "Julien",
      lastName: "Djangone",
      phone: "07 83 91 30 31",
      dateOfBirth: "02/10/1997",
      citizen: 0,
    },
    null,
    2
  ),
  social: JSON.stringify(
    {
      linkedin: null,
      facebook: null,
      twitter: null,
      github: null,
    },
    null,
    2
  ),
  skills: JSON.stringify([2, 4, 8, 10], null, 2),
  domain: 2,
  languages: JSON.stringify(
    [
      { langue: "Français", level: 3 },
      { langue: "Anglais", level: 2 },
    ],
    null,
    2
  ),
};
const PUB_DATAS_URI_EXEMPLE = {
  title: "Work3 Pub",
  description:
    "This is a part where content value stored. I can write everything I want to share at the community or missions community or private community.",
  userID: null,
  image: "img/pub.jpeg",
  tags: JSON.stringify([]),
};

// *::::::::::::: ------- :::::::::::::* //
// *::::::::::::: MISSION :::::::::::::* //
// *::::::::::::: ------- :::::::::::::* //

const MISSION_DATAS_URI_EXEMPLE = {
  title: "Work3 Mission",
  description:
    "This is a part where content value stored. I can write everything I want to describe my mission. This description must provide a maximum of information about the mission. This is a kind of roadmap.",
  // image: "img/mission.png",

  // // Other mission id
  // banniere: "img/banniere.png",
  // reference: null,
  // // social: JSON.stringify(
  // //   {
  // //     facebook: null,
  // //     twitter: null,
  // //     linkedin: null,
  // //     github: null,
  // //   },
  // //   null,
  // //   2
  // // ),
  // experience: 0,
  // disponibilite: 0,
  // userID: null,
  // owner: null,
  // domain: 4,
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
  // image: "https://picsum.photos/id/100/200",
  domain: 2,
  missionID: null,
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
  id: 0,
  tokenAddress: ZERO_ADDRESS,
  numberOfTier: 3,
  maxCap: ethers.parseEther("25"),
  minCap: 10000000,
  minInvest: 300,
  amountRaised: 0,
  maxInvest: ethers.parseEther("25"),
  saleStart: new Date().getTime(),
  saleEnd: new Date().getTime() + 80000000,
  lockedTime: 1,
  totalUser: 0,
};

// *::::::::::::: ------- :::::::::::::* //
// *::::::::::::: MISSION :::::::::::::* //
// *::::::::::::: ------- :::::::::::::* //

const LAUNCHPAD_DATAS_URI_EXEMPLE = {
  title: "Last block",
  description: `🚀 Explorez l'Univers des Tokens ERC-20

Notre launchpad vous ouvre les portes de l'univers passionnant des tokens ERC-20, les pierres précieuses du monde crypto ! 🌟 Pour participer à nos opportunités de financement et d'investissement, voici ce que vous devez savoir :

Tokens ERC-20 💎

Notre launchpad prend en charge exclusivement les tokens ERC-20, qui sont parmi les plus répandus et les plus fiables de l'écosystème blockchain.
Les projets hébergés sur notre plateforme utilisent principalement des tokens ERC-20 pour leurs campagnes de financement.
L'Étape Cruciale : L'Allowance 📈

Avant de commencer à investir dans les projets de notre launchpad, vous devez confier une "allowance" au contrat du launchpad.
L'allowance est une autorisation que vous accordez pour que le contrat du launchpad puisse gérer vos tokens ERC-20 lors de votre participation aux campagnes.
Cette étape est essentielle pour garantir un processus de financement en toute sécurité.
Soyez Prêt à Investir 💰

Une fois que vous avez configuré l'allowance, vous êtes prêt à explorer les projets passionnants sur notre plateforme.
Investissez dans les campagnes qui vous intéressent en utilisant vos tokens ERC-20, en toute confiance, grâce à notre mécanisme sécurisé.
Nous vous invitons à vous plonger dans le monde des tokens ERC-20 sur notre launchpad et à découvrir les opportunités d'investissement les plus prometteuses. Assurez-vous de bien gérer votre allowance pour participer en toute sécurité à nos campagnes passionnantes ! 🌐🔒`,
  image: "img/logo.png",
  banniere: "img/banniere.png",
  domain: 2,
  bio: null,
  social: JSON.stringify(
    { twitter: null, linkedin: null, github: null, facebook: null },
    null,
    2
  ),

  // you can provide a link for more information about the mission like current website
};

const TIER_DATAS_EXEMPLE = {
  maxTierCap: ethers.parseEther("25"),
  minTierCap: ethers.parseEther("8"),
  amountRaised: 0,
  tokenPrice: ethers.parseEther("0.002"),
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
  LAUNCHPAD_DATAS_URI_EXEMPLE,
  transactionCost,
};
