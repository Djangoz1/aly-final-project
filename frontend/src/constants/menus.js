import { CreatePub } from "sections/Pub/form/create/CreatePub";
import {
  icfy,
  icfyCODE,
  icfyHOME,
  icfyIMG,
  icfyINFO,
  icfyTIME,
  icsystem,
} from "icones";
import { styles } from "styles/style";
import { EditTokenLaunchpad } from "sections/Launchpad/form/EditLockToken";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { ENUMS } from "./enums";

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
      { i: "🔌", title: "Blockchain" },
    ],
    page: [
      {
        title: "Account",
        sub: [{ icon: icfy.ux.workspace, title: "Workspace", url: "/" }],
      },
      {
        title: "Overview",
        sub: [
          { icon: icfyINFO, title: "Informations", url: "/informations" },
          { icon: icfyIMG, title: "Gallery", url: "/gallery" },
          { icon: icsystem.mission, title: "Missions", url: "/missions" },
          { icon: icsystem.feature, title: "Features", url: "/features" },
          { icon: icsystem.feature, title: "Jobs", url: "/jobs" },
          { icon: icsystem.launchpad, title: "Launchpads", url: "/launchpads" },
          { icon: icfy.msg.casual, title: "Invitations", url: "/invitations" },
          { icon: icsystem.escrow, title: "Escrows", url: "/escrows" },
        ],
      },

      {
        title: "Social Media",
        sub: [
          { icon: icfy.msg.post, title: "Posts", url: "/social" },
          { icon: icfyCODE, title: "Codes", url: "" },
          { icon: icfy.msg.casual, title: "Messages", url: "" },
          { icon: icfy.like, title: "Likes", url: "" },
        ],
      },
    ],
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Information personnelle" },
      { i: "👨‍💻", title: "Work" },
    ],
  },
  search: {
    page: [
      {
        title: "Search",
        sub: [
          { url: "/search/jobs", title: "Jobs", icon: icsystem.feature },
          { url: "/search/", title: "Freelancers", icon: icsystem.profile },
          {
            url: "/search/launchpads",
            title: "Launchpad",
            ic: icsystem.escrow,
          },
          { url: "/search/disputes", title: "Disputes", icon: icsystem.escrow },
        ],
      },
    ],
  },
  escrow: {
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Informations" },
    ],
    page: [
      {
        title: "Court",
        sub: ENUMS.courts.map((el) => {
          return { title: el.court, icon: el.badge };
        }),
      },
    ],
  },

  pub: {
    page: [
      {
        title: "Overview",
        sub: [
          { icon: icfyTIME, title: "My page" },
          { icon: icfyINFO, title: "All", url: "/" },
          { icon: icfyIMG, title: "Payable", url: "/payables" },
          { icon: icfyTIME, title: "Codes", url: "/codes" },
          { icon: icsystem.feature, title: "Features", url: "/features" },
        ],
      },
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

export const menus_id = (target, id) => {
  let menus = {
    profile: [
      {
        title: "Account",
        sub: [
          {
            icon: icfy.ux.workspace,
            title: "Workspace",
            url: "/profile/" + id + "/",
          },
        ],
      },
      {
        title: "Overview",
        sub: [
          {
            icon: icfyIMG,
            title: "Gallery",
            url: "/profile/" + id + "/gallery",
          },
          {
            icon: icsystem.mission,
            title: "Missions",
            url: "/profile/" + id + "/missions",
          },
          {
            icon: icsystem.feature,
            title: "Features",
            url: "/profile/" + id + "/features",
          },
          {
            icon: icsystem.feature,
            title: "Jobs",
            url: "/profile/" + id + "/jobs",
          },
          {
            icon: icsystem.launchpad,
            title: "Launchpads",
            url: "/profile/" + id + "/launchpads",
          },
          {
            icon: icfy.msg.casual,
            title: "Notifications",
            url: "/profile/" + id + "/notifications",
          },
          {
            icon: icsystem.escrow,
            title: "Escrows",
            url: "/profile/" + id + "/escrows",
          },
        ],
      },

      {
        title: "Social Media",
        sub: [
          {
            icon: icfy.msg.post,
            title: "Posts",
            url: "/profile/" + id + "/social",
          },
          { icon: icfyCODE, title: "Codes" },
          {
            icon: icfy.msg.casual,
            title: "Messages",
            url: "/profile/" + id + "/messages",
          },
          { icon: icfy.like, title: "Likes" },
        ],
      },
      {
        title: "Settings",
        sub: [
          {
            icon: icfy.ux.edit,
            title: "Profile",
            url: "/profile/" + id + "/settings",
          },
        ],
      },
    ],

    launchpad: [
      {
        title: "Launchpad",
        sub: [
          {
            icon: icfy.ux.workspace,
            title: "Workspace",
            url: "/launchpad/" + id + "/",
          },
        ],
      },
      {
        title: "Overview",
        sub: [
          {
            icon: icfyIMG,
            title: "Gallery",
            url: "/launchpad/" + id + "/gallery",
          },
          {
            icon: icsystem.feature,
            title: "Children",
            url: "/launchpad/" + id + "/features",
          },
        ],
      },

      {
        title: "Social Media",
        sub: [
          {
            icon: icfy.msg.post,
            title: "Posts",
            url: "/launchpad/" + id + "/social",
          },
        ],
      },
    ],
    mission: [
      {
        title: "Mission",
        sub: [
          {
            icon: icfy.ux.workspace,
            title: "Overview",
            url: "/mission/" + id + "/",
          },
        ],
      },
      {
        title: "Workspace",
        sub: [
          {
            icon: icfyHOME,
            title: "Desk",
            url: "/mission/" + id + "/desk",
          },

          {
            icon: icfy.msg.casual,
            title: "Invitations",
            url: "/mission/" + id + "/invitations",
          },
          {
            icon: icsystem.escrow,
            title: "Escrow",
            url: "/mission/" + id + "/escrows",
          },
          {
            icon: icsystem.launchpad,
            title: "Launchpad",
            url: "/mission/" + id + "/launchpads",
          },
        ],
      },

      {
        title: "Social Media",
        sub: [
          {
            icon: icfy.msg.post,
            title: "Posts",
            url: "/mission/" + id + "/social",
          },
          {
            icon: icfyIMG,
            title: "Gallery",
            url: "/mission/" + id + "/gallery",
          },
        ],
      },
      {
        title: "Settings",
        sub: [
          {
            icon: icfy.ux.edit,
            title: "Mission",
            url: "/mission/" + id + "/settings",
          },
        ],
      },
    ],
  };
  return menus[target];
};

export let MENUS_ID = (id, owner, cvID) => {
  return {
    mission: [
      {
        url: "//mission/" + id + "/test",
        title: "Overview",
      },
      {
        url: "//mission/" + id + "/features/test",
        title: "Features",
      },
      {
        url: "//mission/" + id + "/agenda/test",
        title: "Agenda",
      },
      {
        url: "//mission/" + id + "/",
        title: "Disputes",
      },
      {
        url: "//mission/" + id + "/pubs/test",
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
