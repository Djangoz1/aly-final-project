import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { MyBadge } from "components/myComponents/box/MyList";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyModal } from "components/myComponents/modal/MyModal";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { ENUMS } from "constants/enums";
import { useToolsState } from "context/tools";
import { icfy, icfyETHER, icfyTIME, icsystem } from "icones";
import React, { useState } from "react";
import { stateCV } from "utils/ui-tools/state-tools";
import { fromTimestamp } from "utils/ux-tools";
import { v4 } from "uuid";

export const CVInfos = () => {
  let { state } = useToolsState();
  console.log(state);
  let [isTabs, setIsTabs] = useState(0);
  let infos = [
    {
      title: "Visibility",
      icon: icfy.eye[state?.profile?.metadatas?.visibility ? "open" : "close"],
      value: (
        <MyStatus
          style={"text-[8px]"}
          target={"profile"}
          status={state?.profile?.metadatas?.visibility ? 0 : 1}
        ></MyStatus>
      ),
    },
    {
      title: "Token accepted",
      icon: icfy.bank.coin,

      value: (
        <MyStatus
          style={"text-[8px]"}
          target={"token"}
          status={state?.profile?.datas?.acceptToken ? 0 : 1}
        ></MyStatus>
      ),
    },
    {
      icon: icfyTIME,

      title: "Created at",
      value: fromTimestamp(state?.profile?.metadatas?.created),
    },

    {
      icon: icfy.bank.dollars,

      title: "Wadge",
      value: (
        <>
          <span className="text-lg font-light mr-3">
            {state?.profile?.details?.work?.wadge}
          </span>
          ETH
        </>
      ),
    },

    {
      icon: icfy.bank.dollars,

      title: "Depense",
      value: (
        <>
          <span className="text-lg font-light mr-3">
            {state?.profile?.details?.work?.depense}
          </span>
          ETH
        </>
      ),
    },

    {
      icon: icfy.code.casual,

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
      icon: icsystem.mission,

      title: "Missions",
      num: state?.profile?.datas?.missions?.length,
    },

    {
      title: "Staked",
      num: state?.profile?.datas?.balance,
    },
    {
      title: "Features",
      num: state?.profile?.datas?.features?.length,
    },
    {
      icon: icsystem.feature,

      title: "Jobs",
      num: state?.profile?.datas?.proposals?.length,
    },
    {
      icon: icsystem.social,

      title: "Pubs",
      num: state?.profile?.details?.social?.pubs,
    },
    {
      icon: icfy.person.friend,

      title: "Followers",
      num: state?.profile?.details?.social?.followers,
    },
    {
      icon: icfy.person.teal,
      title: "Followed",
      num: state?.profile?.details?.social?.followed,
    },
  ];
  let infosDispute = [
    {
      icon: icsystem.escrow,

      title: "Disputes",
      num: state?.profile?.details?.escrows.disputes,
    },

    {
      icon: icsystem.court,
      title: "Nombre Arbitration",
      value: state?.profile?.datas?.arbitrators?.length,
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
    {
      icon: icsystem.launchpad,

      title: "Launchpads",
      value: state?.profile?.datas?.launchpads?.length,
    },
    {
      icon: icfy.bank.coin,

      title: "Amount raised",
      value: (
        <>
          <span className="text-lg font-light mr-3">
            {state?.profile?.details?.launchpad?.raised}
          </span>
          ETH
        </>
      ),
    },
  ];
  let infoOffChain = [
    {
      title: "Identité",
      value: (
        <>
          {["Mr", "Mme"]?.[state?.profile?.metadatas?.identity?.citizen]}{" "}
          {state?.profile?.metadatas?.identity?.firstName}{" "}
          {state?.profile?.metadatas?.identity?.lastName}
        </>
      ),
    },
    {
      title: "Email",
      value: <>{state?.profile?.metadatas.email}</>,
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
      title: <div className="flex flex-col">Skills off chain</div>,
      value: (
        <div className="w-full gap-3 overflow-x-auto grid grid-cols-5 mt-1">
          {state?.profile?.metadatas?.skills?.map((id, i) => (
            <MyBadge color={i} key={v4()}>
              <Icon
                icon={ENUMS.courts?.[id]?.badge}
                className="text-xs my-auto mr-3"
              />
              {ENUMS.courts?.[id]?.court}
            </MyBadge>
          ))}
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
