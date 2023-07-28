import { CVName } from "components/inputs/inputsCV/CVName";
import { icfyETHER, icfyGITHUB, icfyINFO } from "icones";

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
