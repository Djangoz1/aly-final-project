import { Timer } from "components/Timer";
import { CVName } from "components/inputs/inputsCV/CVName";
import { calcTimeRemaining } from "helpers";
import {
  icfyCHAT,
  icfyCODER,
  icfy.bank.coin,
  icfyCV,
  icfyETH,
  icfyETHER,
  icfyGITHUB,
  icfyINFO,
  icfyMISSION,
  icfyROCKET,
  icfySTAR,
  icfyTIME,
} from "icones";

export const missionType = {
  title: "What kind of mission do you need ?",
  values: [
    "Landing page",
    "Mobile App",
    "Bot",
    "E-commerce",
    "Blogs or forum",
    "Algorithm",
    "Portfolio or personal",
    "DApp",
    "Educational ressources",
    "Smart contract",
    "Game",
    "Other",
  ],
};

export const prototypeStats = {
  title: "Do you need a clickable prototype ?",
  values: ["Yes, I want to test the prototype", "No, I don't need a prototype"],
};
export const corporateStats = {
  title: "Do you have a corporate style ?",
  values: [
    "Yes, I have a corporate style",
    "No, I don't have a corporate style",
  ],
};

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

        icon: icfy.bank.coin,
        desc: "Value dispersed",
      },
    },
    {
      values: {
        title: "Missions",
        value: infos?.missions?.length,

        icon: icfyMISSION,
        desc: "Mission(s) created",
      },
    },
    {
      values: {
        title: "Features",
        value: infos?.features?.length,

        icon: icfyCODER,
        desc: "Feature(s) worked",
      },
    },
    {
      values: {
        title: "Launchpads",
        value: infos?.launchpads?.length,

        icon: icfyROCKET,
        desc: "Launchpad(s) created",
      },
    },
    {
      values: {
        title: "Publications",
        value: infos?.pubs?.length,

        icon: icfyCHAT,
        desc: "Publish number",
      },
    },
  ];
};

export const launchpadStats = (datas) => {
  return [
    {
      values: {
        title: "Capitalization",
        value: (
          <>
            {datas?.amountRaised} <span className="ml-1 text-[9px] ">ETH</span>
          </>
        ),
        icon: icfyETH,
        desc: (
          <>
            Min ~ Max :{" "}
            <span className="text-white">
              {parseInt(datas?.minCap)} ~ {parseInt(datas?.maxCap)} ETH
            </span>
          </>
        ),
      },
    },
    {
      values: {
        title: (
          <>
            Token :<span className="text-white"> {datas?.token?.name} </span>
          </>
        ),
        value: (
          <>
            1{" "}
            <span className="ml-1 text-[9px]">
              = {parseInt(datas?.tokenPrice)} ETH
            </span>
          </>
        ),
        icText: datas?.token.symbol,
        desc: (
          <div className=" w-[70px] truncate">
            <span className=" truncate">{datas?.tokenAddress}</span>
          </div>
        ),
      },
    },
    {
      values: {
        title: "Round",
        value: (
          <>
            1 <span className="ml-1 text-[9px]">/ {datas?.numberOfTier}</span>
          </>
        ),
        icon: icfySTAR,
        desc: (
          <>
            Total user :{" "}
            <span className="text-white">{parseInt(datas?.totalUser)}</span>
          </>
        ),
      },
    },
    {
      values: {
        title: "Timing",
        value: (
          <div className="flex text-xs flex-col">
            <div className="flex items-center">
              <span className="text-[9px] text-white mr-3">Start </span>
              <Timer
                units={() => calcTimeRemaining(parseInt(datas?.saleStart))}
              />
            </div>
            <div className="flex  items-center">
              <span className="text-[9px] text-white mr-auto">End </span>
              <Timer
                units={() => calcTimeRemaining(parseInt(datas?.saleEnd))}
              />
            </div>
          </div>
        ),
        icon: icfyTIME,
      },
    },
  ];
};
