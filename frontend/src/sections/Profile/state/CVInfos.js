import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ENUMS } from "constants/enums";
import { useToolsState } from "context/tools";
import { icfy, icfyETHER } from "icones";
import React, { useState } from "react";
import { fromTimestamp } from "utils/ux-tools";
import { v4 } from "uuid";

export const CVInfos = () => {
  let { state } = useToolsState();
  console.log(state);
  let [isTabs, setIsTabs] = useState(0);
  let infos = [
    {
      title: "Visibility",
      value: (
        <MyStatus
          style={"text-[8px]"}
          target={"profile"}
          status={state?.profile?.metadatas?.visibility ? 0 : 1}
        ></MyStatus>
      ),
    },
    {
      title: "Created at",
      value: fromTimestamp(state?.profile?.metadatas?.created),
    },

    {
      title: "Wadge",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.profile?.details?.wadge.toFixed(5)}
        </>
      ),
    },

    {
      title: "Depense",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.profile?.datas?.amount.toFixed(5)}
        </>
      ),
    },

    {
      title: (
        <div className="flex flex-col">
          Skills on chain
          <div className="flex mt-1">
            {state?.profile?.details?.badges?.map((el) => (
              <Icon
                key={v4()}
                icon={ENUMS.courts?.[el]?.badge}
                className="text-white relative c2 text-3xl  "
              />
            ))}
          </div>
        </div>
      ),
      value: state?.profile?.datas?.proposals?.length === 0 && "No job",
    },
  ];
  let infosDatas = [
    {
      title: "Missions",
      num: state?.profile?.datas?.missions?.length,
    },
    {
      title: "Features",
      num: state?.profile?.datas?.features?.length || 0,
    },
    {
      title: "Jobs",
      num: state?.profile?.datas?.proposals?.length,
    },
    {
      title: "Pubs",
      num: state?.profile?.datas?.pubs?.length,
    },
  ];
  let infosDispute = [
    {
      title: "Disputes",
      num: state?.profile?.details?.disputes?.length,
    },

    {
      title: "Invest on court",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.profile?.details?.arbitrators?.totalBalance}
        </>
      ),
    },
    {
      title: "Nombre Arbitration",
      value: state?.profile?.details?.arbitrators?.totalArbitration,
    },

    {
      title: (
        <div className="flex flex-col">
          On Court
          <div className="flex ">
            {state?.profile?.details?.arbitrators?.court?.map((el) => (
              <Icon
                key={v4()}
                icon={ENUMS.courts?.[el]?.badge}
                className="text-white relative c2 text-3xl  "
              />
            ))}
          </div>
        </div>
      ),
      value:
        state?.profile?.details?.arbitrators?.court?.length === 0 &&
        "No arbitrators",
    },
  ];

  let infosLaunchpad = [
    { title: "Launchpads", value: state?.profile?.datas?.launchpads?.length },
    {
      title: "Amount raised",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />

          {state?.profile?.details?.launchpads?.totalRaised}
        </>
      ),
    },
  ];
  let infoOffChain = [
    {
      title: "Identité",
      value: (
        <>
          {state?.profile?.metadatas?.identity?.citizen}{" "}
          {state?.profile?.metadatas?.identity?.firstName}{" "}
          {state?.profile?.metadatas?.identity?.lastName}
        </>
      ),
    },
    {
      title: "Email",
      value: <>{state?.profile?.metadatas?.identity?.email}</>,
    },
    {
      title: "Phone",
      value: <>{state?.profile?.metadatas?.identity?.phone}</>,
    },
    {
      title: "Date of birth",
      value: <>{state?.profile?.metadatas?.identity?.dateOfBirth}</>,
    },
  ];
  let infoOffChaindatas = [
    {
      title: "Spécialité",
      value: (
        <p className="flex items-center capitalize">
          <Icon
            className={`text-${
              ENUMS.domain[state?.profile?.metadatas?.domain]?.color
            } text-lg mr-1`}
            icon={ENUMS.domain[state?.profile?.metadatas?.domain]?.icon}
          />
          {ENUMS.domain[state?.profile?.metadatas?.domain]?.name}
        </p>
      ),
    },

    {
      title: (
        <div className="flex flex-col">
          Skills off chain
          <div className="flex mt-1">
            {state?.profile?.metadatas?.skills?.map((id) => (
              <Icon
                key={v4()}
                icon={ENUMS.courts?.[id]?.badge}
                className="text-white relative c2 text-3xl  "
              />
            ))}
          </div>
        </div>
      ),
    },

    ...(Array.isArray(state?.profile?.metadatas?.languages)
      ? state?.profile?.metadatas?.languages.map((el) => ({
          title: el?.langue,
          value: ENUMS.languagesLevel[el?.level],
        }))
      : []),
  ];
  return (
    <div className="flex-col pt-10 font2 w-full ">
      <MyMenusTabs
        color={17}
        template={2}
        style={"ml-5 mb-8  uppercase font-light font2"}
        value={isTabs}
        setter={setIsTabs}
        arr={["On chain", "Off chain"]}
      />
      <div className="flex  w-full">
        <MyCardInfos
          title={"Work protocole "}
          style={"w-full  rounded-none "}
          arr={[infos, infoOffChain][isTabs]}
        />
      </div>
      <MyCardInfos
        title={"Datas protocole "}
        style={"w-full ml-[1px]   rounded-none "}
        arr={[infosDatas, infoOffChaindatas][isTabs]}
      />
      {isTabs === 0 && (
        <div className="flex flex-col  w-full  ml-[1px]">
          <MyCardInfos
            style={"rounded-b-none rounded-t-none text-right w-full mb-[1px] "}
            title={"Escrow protocole"}
            arr={infosDispute}
          />
          <MyCardInfos
            style={"rounded-t-none text-right w-full "}
            title={"Launchpad protocole"}
            arr={infosLaunchpad}
          />
        </div>
      )}
    </div>
  );
};
