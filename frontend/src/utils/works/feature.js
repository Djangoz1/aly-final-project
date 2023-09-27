import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ENUMS, ENUMS_COURTS } from "constants/enums";
import { icfyETHER } from "icones";

export let _table_invites = (features) => {
  let list = [];
  for (let index = 0; index < features?.length; index++) {
    const feature = features?.[index];
    if (parseInt(feature?.datas?.startedAt) === 0) {
      let arr = [
        <Icon
          icon={ENUMS.courts[feature.datas.specification].badge}
          className="text-2xl"
        />,
        <div className="flex items-center">
          <div className="flex flex-col">
            <p className="text-sm text-white">{feature.metadatas.title}</p>
            <p className="">
              {ENUMS.courts[feature.datas.specification].court}
            </p>
          </div>
        </div>,
        <div className="">
          <CVName cvID={feature.datas.owner} />
        </div>,
        <div className="">{feature.datas.estimatedDays}</div>,
        <div className="text-right">{feature.datas.wadge} ETH</div>,
      ];
      list.push({ arr, id: parseInt(feature?.datas?.id) });
    }
  }

  return list;
};

export let HEAD_table_invites = [
  "",
  "Job",
  "Owner",
  "Temps requis (jours)",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];
