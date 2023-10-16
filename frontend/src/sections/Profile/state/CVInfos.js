import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { MyCardInfos } from "components/myComponents/card/MyCard";
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
  let [isTabs, setIsTabs] = useState(0);
  let infos = [
    {
      title: "Visibility",
      value: (
        <div
          className={`flex items-center  p-3  badge badge-outline badge-xs text-xs badge-${
            state?.owner?.metadatas?.attributes?.[0]?.visibility
              ? "error"
              : "success"
          }`}
        >
          <Icon
            icon={
              state?.owner?.metadatas?.attributes?.[0]?.visibility
                ? icfy.eye.open
                : icfy.eye.close
            }
            className="text-lg mr-4"
          />
          {state?.owner?.metadatas?.attributes?.[0]?.visibility
            ? "Visible"
            : "Invisible"}
        </div>
      ),
    },
    {
      title: "Created at",
      value: fromTimestamp(state?.owner?.metadatas?.attributes?.[0]?.createdAt),
    },

    {
      title: "Wadge",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.owner?.details?.wadge.toFixed(5)}
        </>
      ),
    },

    {
      title: "Depense",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.owner?.datas?.amount.toFixed(5)}
        </>
      ),
    },
    {
      title: "Missions",
      value: state?.owner?.datas?.missions,
    },
    {
      title: "Features",
      value: state?.owner?.datas?.features,
    },
    {
      title: "Jobs",
      value: state?.owner?.datas?.proposals?.length,
    },
    {
      title: "Pubs",
      value: state?.owner?.datas?.pubs,
    },

    {
      title: (
        <div className="flex flex-col">
          Skills on chain
          <div className="flex mt-1">
            {state?.owner?.details?.badges?.map((el) => (
              <Icon
                key={v4()}
                icon={ENUMS.courts?.[el]?.badge}
                className="text-white relative c2 text-3xl  "
              />
            ))}
          </div>
        </div>
      ),
      value: state?.owner?.datas?.proposals?.length === 0 && "No job",
    },
  ];
  let infosDispute = [
    {
      title: "Disputes",
      value: state?.owner?.details?.disputes?.length,
    },

    {
      title: "Invest on court",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />
          {state?.owner?.details?.arbitrators?.totalBalance}
        </>
      ),
    },
    {
      title: "Nombre Arbitration",
      value: state?.owner?.details?.arbitrators?.totalArbitration,
    },

    {
      title: (
        <div className="flex flex-col">
          On Court
          <div className="flex ">
            {state?.owner?.details?.arbitrators?.court?.map((el) => (
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
        state?.owner?.details?.arbitrators?.court?.length === 0 &&
        "No arbitrators",
    },
  ];

  let infosLaunchpad = [
    { title: "Launchpads", value: state?.owner?.datas?.launchpads?.length },
    {
      title: "Amount raised",
      value: (
        <>
          <Icon icon={icfyETHER} className="text-lg mr-4" />

          {state?.owner?.details?.launchpads?.totalRaised}
        </>
      ),
    },
  ];
  let infoOffChain = [
    {
      title: "Identité",
      value: (
        <>
          {state?.owner?.metadatas?.attributes?.[0]?.identity?.citizen}{" "}
          {state?.owner?.metadatas?.attributes?.[0]?.identity?.firstName}{" "}
          {state?.owner?.metadatas?.attributes?.[0]?.identity?.lastName}
        </>
      ),
    },
    {
      title: "Email",
      value: <>{state?.owner?.metadatas?.attributes?.[0]?.identity?.email}</>,
    },
    {
      title: "Phone",
      value: <>{state?.owner?.metadatas?.attributes?.[0]?.identity?.phone}</>,
    },
    {
      title: "Date of birth",
      value: (
        <>{state?.owner?.metadatas?.attributes?.[0]?.identity?.dateOfBirth}</>
      ),
    },

    {
      title: "Spécialité",
      value: (
        <p className="flex items-center capitalize">
          <Icon
            className={`text-${
              ENUMS.domain[state?.owner?.metadatas?.attributes?.[0]?.domain]
                ?.color
            } text-lg mr-1`}
            icon={
              ENUMS.domain[state?.owner?.metadatas?.attributes?.[0]?.domain]
                ?.icon
            }
          />
          {ENUMS.domain[state?.owner?.metadatas?.attributes?.[0]?.domain]?.name}
        </p>
      ),
    },

    {
      title: (
        <div className="flex flex-col">
          Skills off chain
          <div className="flex mt-1">
            {state?.owner?.metadatas?.attributes?.[0]?.skills?.map((id) => (
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

    ...(Array.isArray(state?.owner?.metadatas?.attributes?.[0]?.languages)
      ? state?.owner?.metadatas?.attributes?.[0]?.languages.map((el) => ({
          title: el?.langue,
          value: ENUMS.languagesLevel[el?.level],
        }))
      : []),
  ];
  return (
    <>
      <MyMenusTabs
        value={isTabs}
        setter={setIsTabs}
        arr={["On chain", "Off chain"]}
      />
      <div className="flex">
        <MyCardInfos
          title={"Work protocole"}
          style={"w-1/3 rounded-tl-none"}
          arr={[infos, infoOffChain][isTabs]}
        />
        {
          [
            <div className="flex flex-col w-1/4 ml-3">
              <MyCardInfos
                style={"rounded-b-none"}
                title={"Escrow protocole"}
                arr={infosDispute}
              />
              <MyCardInfos
                style={"rounded-t-none mt-1"}
                title={"Launchpad protocole"}
                arr={infosLaunchpad}
              />
            </div>,
            <MyModal
              styles={{
                btn: "btn-ghost ml-5 w-fit h-fit overflow-scroll hide-scrollbar",
              }}
              btn={
                <ImagePin
                  style={"h-[70vh] w-[35vw]"}
                  CID={state?.owner?.metadatas?.attributes?.[0]?.cvImg}
                />
              }
              modal={
                <ImagePin
                  style={"h-[90vh] w-[80vw] "}
                  CID={state?.owner?.metadatas?.attributes?.[0]?.cvImg}
                />
              }
            />,
          ][isTabs]
        }
      </div>
    </>
  );
};
