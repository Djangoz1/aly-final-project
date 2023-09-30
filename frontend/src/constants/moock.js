// ************ ------- ************ //
// ************ Profile ************ //
// ************ ------- ************ //

import { ethers } from "ethers";

export let moock_create_profile = {
  id: null,
  address: null,
  username: null,
  description: null, // bio
  image: null, // uri
  visibility: false,
  cvImg: null, // uri
  banniere: null,
  firstName: null,
  lastName: null,
  phone: null,
  email: null,
  dateOfBirth: null,
  citizen: null,
  linkedin: null,
  facebook: null,
  twitter: null,
  github: null,
  createdAt: Date.now(),
  skills: [],
  domain: null,
  languages: [],
};

export let moock_create_profile_placeholder = {
  username: "JoDoe",
  description: "Write your bio", // bio
  firstName: "John",
  lastName: "Doe",
  phone: "07.83.91.30.31",
  email: "jg.djangone@gmail.com",
  linkedin: "URL de ...",
  facebook: "URL de ...",
  twitter: "URL de ...",
  github: "URL de ...",
};

export let moock_create_profile_checked = [
  [],
  ["username", "firstName", "lastName", "email", "dateOfBirth", "citizen"],
  [],
];

export let moock_edit_profile = {
  address: null,
  username: null,
  description: null,
  image: null, // uri
  visibility: false,
  cvImg: null, // uri
  banniere: null,
  phone: null,
  email: null,
  linkedin: null,
  facebook: null,
  twitter: null,
  github: null,
  skills: [],
  domain: null,
  languages: [],
};

export let toMockProfile = ({ address, metadatas, cvID }) => {
  let attributes = metadatas.attributes?.[0];
  let identity = attributes?.identity;
  let moock = {
    id: cvID,
    address: address,
    username: metadatas?.username,
    description: metadatas?.description,
    image: metadatas?.image,
    visibility: metadatas?.visibility,
    cvImg: attributes?.cvImg,
    banniere: attributes?.banniere,
    firstName: identity?.firstName,
    lastName: identity?.lastName,
    phone: identity?.phone,
    email: identity?.email,
    dateOfBirth: identity?.dateOfBirth,
    citizen: identity?.citizen,
    linkedin: attributes?.social?.linkedin,
    github: attributes?.social?.github,
    facebook: attributes?.social?.twitter,
    twitter: attributes?.social?.facebook,
    skills: attributes?.skills,
    domain: attributes?.domain,
    languages: attributes?.languages,
    createdAt: attributes.createdAt,
  };

  return moock;
};

// ************ ------- ************ //
// ************ MISSION ************ //
// ************ ------- ************ //

export let moock_create_mission = {
  title: null,
  domain: null,
  image: null,
  banniere: null,
  description: null,
  reference: null,
  launchpad: null,
};

export let moock_create_mission_placeholder = {
  title: "Title of mission",
  domain: "What's domain of mission ?",
  image: null,
  banniere: null,
  description: "Write your description of mission",
  reference: "Reference of mission",
  launchpad: "Is it finance from a launchpad ?",
};

// ************ ------- ************ //
// ************ FEATURE ************ //
// ************ ------- ************ //

export let moock_create_feature = {
  ia: true,
  title: null,
  domain: null,
  image: null,
  description: null,
  missionID: null,
  specification: null,
  experience: null,
  wadge: null,
  worker: null,
  estimatedDays: null,
  onlyInvite: true,
};
export let moock_create_feature_placeholders = {
  title: "Recherche développeur frontend",
  domain: "What's domain of feature ?",
  description: "Write your description ...",
  missionID: "Pour quelle mission ? ",
  specification: "Quelle technologie ?",

  wadge: "10",
  worker: "Name of worker",
  estimatedDays: "10",
};

// ********** --------- ********** //
// ********** LAUNCHPAD ********** //
// ********** --------- ********** //

export let moock_create_launchpad = {
  tokenAddress: null,
  isAddress: null,
  tokenAllowance: null,
  numberOfTier: null,
  maxCap: null, // bio
  minCap: null, // uri
  minInvest: null,
  maxInvest: null, // uri
  saleStart: null,
  saleEnd: null,
  lockedTime: null,
  rounds: [],
  tokenPrice: [],
  maxTiersCap: [],
  minTiersCap: [],
  linkedin: null,
  facebook: null,
  twitter: null,
  github: null,
  createdAt: Date.now(),
  title: null,
  description: null,
  image: null,
  banniere: null,
  domain: null,
  website: null,
};

export let moock_create_launchpad_checked = [
  [],
  ["title", "website", "domain", "description"],
  ["tokenAddress", "tokenAllowance", "minInvest", "maxInvest"],
  [
    "lockedTime",
    "saleStart",
    "saleEnd",
    "maxTiersCap",
    "minTiersCap",
    "tokenPrice",
  ],
];

export let moock_create_launchpad_superchecked = (form, pointer) => {
  let checkTierDatas = false;

  if (pointer === 3) {
    for (let index = 0; index < form?.maxTiersCap?.length; index++) {
      let maxCap = form?.maxTiersCap?.[index];
      let minCap = form?.minTiersCap?.[index];
      let tokenPrice = parseFloat(form?.tokenPrice?.[index]);
      if (minCap < maxCap) {
        checkTierDatas = true;
      }
      if (tokenPrice == 0) {
        checkTierDatas = false;
      }
    }
    if (form?.maxTiersCap?.length === 0) {
      checkTierDatas = false;
    }
  }

  return [
    [],
    [],
    [
      {
        bool: form?.isAddress,
      },
      { bool: parseFloat(form?.tokenAllowance) > 0.01 },
      { bool: parseFloat(form?.minInvest) > 0.01 },
      { bool: parseFloat(form?.maxInvest) > parseFloat(form?.minInvest) },
    ],
    [
      { bool: checkTierDatas },
      { bool: parseInt(form?.rounds) > 1 && parseInt(form?.rounds) <= 5 },
      { bool: parseInt(form?.lockedTime) > 1 },
    ],
  ];
};
export let moock_create_launchpad_placeholder = {
  tokenAddress: "ERC20 token address",
  tokenAllowance: "300",
  maxTiersCap: "300 ETH", // bio
  minTiersCap: "200 ETH", // uri
  website: "URL website",
  minInvest: "10 ETH",
  rounds: "5 rounds",
  maxInvest: "15 ETH", // uri
  saleStart: "Date de début",
  saleEnd: "Date de fin",
  lockedTime: "Time lock",
  tokenPrice: "0.03 ETH",
  linkedin: "URL linkedin",
  facebook: "URL facebook",

  twitter: "URL twitter",
  github: "URL Github",
  createdAt: Date.now(),
  title: "Title project",
  description: "Write your description project ...",
  domain: "What's domain of project",
};
