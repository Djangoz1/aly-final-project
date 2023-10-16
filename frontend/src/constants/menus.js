import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CreateFeature } from "sections/works/Features/form/create/CreateFeature";
import { icfy } from "icones";
import { styles } from "styles/style";
import { EditTokenLaunchpad } from "sections/Launchpad/form/EditLockToken";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";

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

export const MENUS_EDIT = {
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
  invite: [
    { icon: icfy.person.uncheck, title: "Refuse job" },
    { icon: icfy.person.friend, title: "Accept job" },
  ],
};

export const MENUS = {
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
  escrow: {
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Informations" },
    ],
  },
  // launchpad: {
  //   edit: [
  //     { i: "👤", title: "Information personnelle" },
  //     { i: "🫂", title: "Social" },
  //     { i: "👨‍💻", title: "Work" },
  //     { i: "🔌", title: "Blockchain" },
  //   ],
  //   create: [
  //     { i: "ℹ️", title: "Introduction" },
  //     { i: "🗂️", title: "Information personnelle" },
  //     { i: "💰", title: "Token" },
  //     { i: "🔌", title: "Blockchain" },
  //     { i: "🤖", title: "L'IA Aly" },
  //   ],
  // },
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
        url: "/works/mission/" + id + "/test",
        title: "Overview",
      },
      {
        url: "/works/mission/" + id + "/features/test",
        title: "Features",
      },
      {
        url: "/works/mission/" + id + "/agenda/test",
        title: "Agenda",
      },
      {
        url: "/works/mission/" + id + "/",
        title: "Disputes",
      },
      {
        url: "/works/mission/" + id + "/pubs/test",
        title: "Pubs",
      },
    ],
    launchpad: [
      {
        title: "Overview",
        link: `/launchpad/${id}`,
      },

      {
        style: "ml-auto",
        component: <EditTokenLaunchpad btn={"Lock token"} />,
      },
    ],

    edit: {
      invite: [
        {
          icon: icfy.person.uncheck,
          title: "Refuse job",
          setter: () => _apiPost("declineJob", [id]),
        },
        {
          icon: icfy.person.friend,
          title: "Accept job",
          setter: () => _apiPost("acceptJob", [id]),
        },
      ],
    },

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
        link: `/profile/${id}/jobs`,
      },
      {
        title: "CV",
        link: `/profile/${id}/cv`,
      },
      {
        style: "ml-auto",
        component: owner == cvID && (
          <CreatePub btn={"Create post"} styles={styles.gbtn + " btn-xs"} />
        ),
      },
      {
        style: "ml-4",
        component: owner == cvID && (
          <Link className={styles.gbtn + "gr1  btn-xs"}>Create mission</Link>
        ),
      },
    ],
  };
};
