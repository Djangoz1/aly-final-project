import { CVName } from "components/inputs/inputsCV/CVName";
import {
  icfyCODER,
  icfyCOIN,
  icfyCV,
  icfyETHER,
  icfyGITHUB,
  icfyINFO,
  icfyMISSION,
} from "icones";

export const missionStats = (metadata) => {
  return [
    {
      values: {
        icon: icfyGITHUB,
        value: <CVName address={metadata?.owner} />,
        desc: (
          <a
            className="max-w-[180px] flex  hover:text-info truncate"
            href={metadata?.url}
          >
            <span className="truncate">
              {metadata?.url === "" ? "No link provided" : metadata?.url}
            </span>
          </a>
        ),
        title: "Owner",
      },
    },
    {
      values: {
        icon: icfyINFO,
        value: metadata?.title,
        desc: `Tasks number : ${metadata?.features?.length}`,
        title: "Information",
      },
    },
    {
      values: {
        icon: icfyETHER,
        value: metadata?.totalAmount,
        desc: `ETH`,
        title: "Amount",
      },
    },
  ];
};

export const profileStats = (infos) => {
  return [
    {
      values: {
        title: "Owner",
        value: <CVName address={infos?.cvAddress} />,
        icon: icfyCV,
        desc: (
          <div className="flex flex-col  justify-center w-[70px] truncate">
            <p className=" leading-none  truncate text-[9px]">
              CV :<span className="text-[7px] ml-2">{infos?.cvAddress}</span>
            </p>
            <p className=" leading-none  truncate text-[9px]">
              Owner :<span className="text-[7px] ml-2">{infos?.address}</span>
            </p>
          </div>
        ),
      },
    },
    {
      values: {
        title: "Amount",
        value: infos?.amountDispersed,

        icon: icfyCOIN,
        desc: "Value dispersed",
      },
    },
    {
      values: {
        title: "Missions",
        value: infos?.missions?.length,

        icon: icfyMISSION,
        desc: "Number mission created",
      },
    },
    {
      values: {
        title: "Features",
        value: infos?.features?.length,

        icon: icfyCODER,
        desc: "Number features worked",
      },
    },
  ];
};
