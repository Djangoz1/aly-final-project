import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CreateFeature } from "sections/Features/form/CreateFeature";
import { icfy } from "icones";
import { CreateMission } from "sections/Missions/form/CreateMission";

export let MENUS = {
  profile: {
    edit: [
      { i: "👤", title: "Information personnelle" },
      { i: "🫂", title: "Social" },
      { i: "👨‍💻", title: "Work" },
      { i: "🔌", title: "Blockchain" },
    ],
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Information personnelle" },
      { i: "👨‍💻", title: "Work" },
    ],
  },
  feature: {
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Informations" },
      { i: "🔌", title: "Blockchain" },
      { i: "🤖", title: "L'IA Aly" },
    ],
  },
};

export let MENUS_ID = (id, owner, cvID) => {
  return {
    mission: [
      {
        title: "Overview",
        link: `/works/mission/${id}`,
      },
      {
        title: "Features",
        link: `/works/mission/${id}/features`,
      },
      {
        title: "Budget",
        link: "/profile",
      },
      {
        title: "Pubs",
        link: `/works/mission/${id}/pubs`,
      },
      {
        style: "ml-auto",
        component: <CreatePub missionID={id} btn={"Create post mission"} />,
      },
      {
        style: "mx-4",
        component: cvID == owner && <CreateFeature />,
      },
    ],
    profile: [
      {
        title: "Overview",
        link: `/profile/${id}`,
      },
      {
        title: "Missions",
        link: `/profile/${id}/missions`,
      },
      {
        title: "Arbitrage",
        link: "/",
      },
      {
        title: "Jobs",
        link: "/",
      },
      {
        title: "Pubs",
        link: `/profile/${id}/pubs`,
      },
      {
        style: "ml-auto",
        component: owner == cvID && (
          <CreatePub
            btn={"Create post"}
            styles={"ml-5 btn btn-xs btn-primary btn-outline"}
          />
        ),
      },
      {
        style: "ml-4",
        component: owner == cvID && <CreateMission />,
      },
    ],
  };
};

export const MENUS_CREATE_FEATURE = [
  { i: "ℹ️", title: "Introduction" },
  { i: "🗂️", title: "Informations" },
  { i: "🔌", title: "Blockchain" },
  { i: "🤖", title: "L'IA Aly" },
];

export let MENUS_CREATE_MISSION = [
  { i: "ℹ️", title: "Introduction" },
  { i: "🗂️", title: "Informations" },
  { i: "🔌", title: "Blockchain" },
  { i: "🤖", title: "L'IA Aly" },
];

export let MENUS_EDIT = {
  mission: [
    { icon: icfy.code.casual, title: "Create Feature" },
    { icon: icfy.msg.chat, title: "Publish" },
    { icon: icfy.work.casual, title: "View profile" },
    { icon: icfy.person.friend, title: "Follow mission" },
  ],
  feature: [
    { icon: icfy.person.add, title: "Invite worker" },
    { icon: icfy.court.vote, title: "Postulé" },
    { icon: icfy.ux.warning, title: "Change status" },
  ],
};
