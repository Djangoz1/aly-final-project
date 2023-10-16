import { icfy, icfyCODE, icfyCODER, icfyGITHUB } from "icones";

export const STATUS = {
  _feature: {
    hiring: { icon: icfy.hand.check, status: "Hiring", color: "warning" },
  },
  feature: [
    { icon: icfy.code.casual, status: "Process", color: "info" },
    { icon: icfy.code.tool, status: "Improve", color: "warning" },
    { icon: icfy.bank.check, status: "Validated", color: "success" },
    { icon: icfy.court.justice, status: "Contest", color: "error" },
  ],

  dispute: [
    { status: "Initial", icon: icfy.code.tool, color: "success" },
    { status: "Reclaimed", icon: icfy.code.tool, color: "success" },
    { status: "Disputed", icon: icfy.code.tool, color: "success" },
    { status: "Tally", icon: icfy.code.tool, color: "success" },
    { status: "Resolved", icon: icfy.code.tool, color: "success" },
  ],

  mission: [
    { status: "Process", icon: icfy.code.casual, color: "success" },
    { status: "Close", icon: icfy.bank.check, color: "info" },
    { status: "Contest", icon: icfy.court.justice, color: "warning" },
  ],

  launchpad: [
    { status: "Waiting", icon: icfy.code.casual, color: "info" },
    { status: "Init", icon: icfy.bank.check, color: "success" },
    { status: "Paused", icon: icfy.court.justice, color: "warning" },
    { status: "Closed", icon: icfy.court.justice, color: "info" },
  ],
};
