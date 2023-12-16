// ************ ------- ************ //
// ************ Profile ************ //
// ************ ------- ************ //

import { ethers } from "ethers";

export let moock_social_placeholders = {
  linkedin: "URL de ...",
  facebook: "URL de ...",
  twitter: "URL de ...",
  github: "URL de ...",
};

export let moock_create_post = {
  target: "Post",
  description: null,
  image: null,
  code: null,
  file: null,
  missionID: null,
  answerID: null,
  reference: null,
  amount: null,
  language: null,
  tags: null,
};

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
  ...moock_social_placeholders,
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
  let attributes = metadatas;
  let identity = metadatas?.identity;
  let moock = {
    target: "Profile",
    id: cvID,
    address: address,
    username: metadatas?.username,
    description: metadatas?.description,
    avatar: metadatas?.avatar,
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
    facebook: attributes?.social?.facebook,
    twitter: attributes?.social?.twitter,
    skills: attributes?.skills,
    domain: attributes?.domain,
    languages: attributes?.languages,
    created: attributes?.created,
  };

  return moock;
};

export let toMockMission = ({ metadatas, address, missionID }) => {
  return {
    target: "Mission",
    id: missionID,
    owner: address,
    abstract: metadatas?.abstract,
    banniere: metadatas?.banniere,
    image: metadatas?.image,
    github: metadatas?.social?.github,
    linkedin: metadatas?.social?.linkedin,
    facebook: metadatas?.social?.facebook,
    twitter: metadatas?.social?.twitter,
  };
};

export let moock_create_escrow = {
  target: "escrow",
  image: null,
  arbitrators: null,
  appeal: null,
  feature: null,
  court: null,
  description: null,
};
export let moock_create_escrow_placeholder = {
  target: "escrow",
  arbitrators: "Number of arbitrators",
  appeal: "Appeal delay",
  feature: "For wich feature",
  court: "Do you want switch court ?",
  description: "Write reason of dispute",
};

// ************ ------- ************ //
// ************ MISSION ************ //
// ************ ------- ************ //

export let moock_create_mission = {
  target: "mission",
  title: null,
  domain: null,
  image: null,
  abstract: null,
  budget: null,
  company: null,
  features: null,
  banniere: null,
  description: null,
  reference: null,
  launchpad: null,
  aiAssisted: true,
  ai: { recommandations: null },
};

export let moock_create_mission_placeholder = {
  title: "Title of mission",
  domain: "What's domain of mission ?",
  image: null,
  company: "Name of your company",
  abstract: "Hi, for a new <>project name</> we're looking ...",
  budget: "Budget max (en €)",
  features: "Nombre de tâches maximum",
  banniere: null,
  description: `The mission consists to <>purpose</> with <>techno</>.
I want this features on my project : 
<>
  features lists
</>`,
  reference: "Reference of mission",
  launchpad: "Is it finance from a launchpad ?",
  ...moock_social_placeholders,
};

// ************ ------- ************ //
// ************ FEATURE ************ //
// ************ ------- ************ //

export let moock_create_feature = {
  target: "feature",
  ia: true,
  title: null,
  price: 0,
  abstract: null,
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
  description: moock_create_mission_placeholder.description,
  missionID: "Pour quelle mission ? ",
  specification: "Quelle technologie ?",
  abstract: moock_create_mission_placeholder.abstract,
  wadge: "1.2 ETH",
  worker: "Name of worker",
  estimatedDays: "10 Days",
};

// ********** --------- ********** //
// ********** LAUNCHPAD ********** //
// ********** --------- ********** //

export let moock_create_launchpad = {
  maxCap: null, // bio
  minCap: null, // uri
  minInvest: null,
  maxInvest: null, // uri
  saleStart: null,
  saleEnd: null,

  linkedin: null,
  facebook: null,
  twitter: null,
  github: null,

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
  ["saleStart", "saleEnd", "minInvest", "maxInvest", "maxCap", "minCap"],
];

export let moock_create_launchpad_superchecked = (form, pointer) => {
  let checkTierDatas = false;

  if (pointer === 2) {
    let maxCap = form?.maxCap;
    let minCap = form?.minCap;
    if (minCap < maxCap) {
      checkTierDatas = true;
    }
  }

  return [
    [],
    [],

    [
      { bool: parseFloat(form?.maxInvest) > parseFloat(form?.minInvest) },
      { bool: checkTierDatas },
    ],
  ];
};
export let moock_create_launchpad_placeholder = {
  maxCap: "300 ETH", // bio
  minCap: "200 ETH", // uri
  website: "URL website",
  minInvest: "10 ETH",

  maxInvest: "15 ETH", // uri
  saleStart: "Date de début",
  saleEnd: "Date de fin",
  title: "Title project",
  description: "Write your description project ...",
  domain: "What's domain of project",
  ...moock_social_placeholders,
};

export const MOOCK = {
  mission: {
    form: moock_create_mission,
    placeholders: moock_create_mission_placeholder,
  },
  profile: {
    form: moock_create_profile,
    placeholders: moock_create_profile_placeholder,
    checked: moock_create_profile_checked,
  },
  feature: {
    form: moock_create_feature,
    placeholders: moock_create_feature_placeholders,
  },
  launchpad: {
    form: moock_create_launchpad,
    placeholders: moock_create_launchpad_placeholder,
    checked: moock_create_launchpad_checked,
    superChecked: moock_create_launchpad_superchecked,
  },
  escrow: {
    form: moock_create_escrow,
    placeholders: moock_create_escrow_placeholder,
  },
};
