import { icfy, icfyCODE, icfyCODER, icfyGITHUB } from "icones";

export const STATUS = {
  _feature: {
    hiring: { icon: icfy.hand.check, status: "Hiring", color: "text-warning" },
  },
  feature: [
    { icon: icfy.code.casual, status: "Process", color: "text-info" },
    { icon: icfy.code.tool, status: "Improve", color: "text-warning" },
    { icon: icfy.bank.check, status: "Validated", color: "text-success" },
    { icon: icfy.court.justice, status: "Contest", color: "text-error" },
  ],

  mission: [
    { status: "Process", icon: icfy.code.casual, color: "text-success" },
    { status: "Close", icon: icfy.bank.check, color: "text-info" },
    { status: "Contest", icon: icfy.court.justice, color: "text-warning" },
  ],
};
