import { icfy, icfyCODE, icfyCODER, icfyGITHUB } from "icones";
import {
  createURI,
  createURICv,
  refreshURI,
} from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "./web3";

export const _STATUS = async ({ state, to, target }) => {
  let funcs = {
    profile: [
      async () => {
        let metadatas = { ...state?.profile?.metadatas };
        metadatas.attributes[0].visibility = true;

        let uri = await createURI({
          title: "CV",
          id: state?.profile?.cvID,
          metadatas: metadatas,
        });
        if (uri) {
          _apiPost("setTokenURIOf", [
            parseInt(`${state?.profile?.cvID}`),
            uri,
            ADDRESSES["cvsHub"],
          ]);
        }
      },
      async () => {
        let metadatas = { ...state?.profile?.metadatas };
        metadatas.attributes[0].visibility = false;

        let uri = await createURI({
          title: "CV",
          id: state?.profile?.cvID,
          metadatas: metadatas,
        });

        if (uri) {
          let hash = await _apiPost("setTokenURIOf", [
            parseInt(state?.profile?.cvID),
            uri,
            ADDRESSES["cvsHub"],
          ]);
        }
      },
    ],
    mission: [
      undefined,
      async () => {
        await _apiPost("closeMission", [parseInt(state?.mission?.missionID)]);
      },
    ],
  };

  await funcs[target][to]();
};

export const STATUS = {
  _feature: {
    hiring: {
      icon: icfy.hand.check,
      status: "Hiring",
      color: "warning",
      bg: " border-warning/40 bg-warning/10 ",
    },
  },

  court: [
    {
      icon: icfy.ux.check.casual,
      status: "On court",
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      icon: icfy.ux.check.uncheck,
      status: "Not on court",
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
  ],

  profile: [
    {
      icon: icfy.eye.open,
      status: "Disponible",
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      icon: icfy.eye.close,
      status: "Indisponible",
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
  ],
  visibility: [
    {
      icon: icfy.eye.open,
      status: "Disponible",
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      icon: icfy.eye.close,
      status: "Indisponible",
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
  ],
  feature: [
    {
      icon: icfy.code.casual,
      status: "Process",
      color: "info",
      bg: " border-info/40 bg-info/10 ",
    },
    {
      icon: icfy.code.tool,
      status: "Improve",
      color: "warning",
      bg: " border-warning/40 bg-warning/10 ",
    },
    {
      icon: icfy.bank.check,
      status: "Validated",
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      icon: icfy.court.justice,
      status: "Contest",
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
  ],

  arbitratorForDispute: [
    {
      status: "Waiting",
      icon: icfy.code.tool,
      color: "warning",
      bg: " border-warning/40 bg-warning/10 ",
    },
    {
      status: "Invited",
      icon: icfy.code.tool,
      color: "info",
      bg: " border-info/40 bg-info/10 ",
    },
    {
      status: "Refused",
      icon: icfy.code.tool,
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
    {
      status: "Accepted",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
  ],
  dispute: [
    {
      status: "Initial",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Reclaimed",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Disputed",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Tally",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Resolved",
      icon: icfy.code.tool,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
  ],

  mission: [
    {
      status: "Process",
      icon: icfy.code.casual,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Close",
      icon: icfy.bank.check,
      color: "info",
      bg: " border-info/40 bg-info/10 ",
    },
    {
      status: "Contest",
      icon: icfy.court.justice,
      color: "warning",
      bg: " border-warning/40 bg-warning/10 ",
    },
  ],

  launchpad: [
    {
      status: "Waiting",
      icon: icfy.code.casual,
      color: "info",
      bg: " border-info/40 bg-info/10 ",
    },
    {
      status: "Started",
      icon: icfy.bank.check,
      color: "success",
      bg: " border-success/40 bg-success/10 ",
    },
    {
      status: "Paused",
      icon: icfy.court.justice,
      color: "warning",
      bg: " border-warning/40 bg-warning/10 ",
    },
    {
      status: "Closed",
      icon: icfy.court.justice,
      color: "error",
      bg: " border-error/40 bg-error/10 ",
    },
  ],
};
