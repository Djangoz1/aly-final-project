import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import { icfy, icfyETHER } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateCV, stateFeature } from "utils/ui-tools/state-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const ListJobs = ({ bool }) => {
  let [isList, setIsList] = useState(null);
  let { cv } = useAuthState();
  let fetch = async () => {
    let arr = [];
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["featuresHub"]])
    );

    for (let index = 1; index <= length; index++) {
      const element = await stateFeature(index);
      element.owner = await stateCV(element.datas.owner);

      if (!bool || (bool && bool(element))) {
        arr.push(element);
      }
    }
    setIsList(arr);
  };

  useEffect(() => {
    if (!isList) {
      fetch();
    }
  }, [bool]);

  STATUS;

  return (
    <div className="flex box-border w-fit  justify-center flex-wrap">
      {isList?.map((el) => (
        <MyCardPrice
          description={
            <div className="flex flex-col">
              <div className="flex items-center">
                <Icon icon={icfy.work.casual} />
                <CVName
                  cvID={el?.datas?.owner}
                  metadata={el?.owner?.metadatas}
                  styles={"text-xs text-white/60 mx-auto"}
                />
              </div>
            </div>
          }
          lists={[
            {
              title: "On invitation",
              check: el?.datas?.isInviteOnly,
            },
            {
              title: "Accept token ERC 20",
              check: false,
            },
            {
              title: (
                <div className="flex items-center">
                  <span className="c4 mr-2">Worker:</span>
                  <CVName cvID={el?.datas?.cvWorker} />
                </div>
              ),
              check: el?.datas?.cvWorker > 0,
            },
            {
              title: (
                <MyStatus
                  status={el?.datas?.status}
                  normal={true}
                  target={"feature"}
                />
              ),
              check: el?.datas?.status === 2,
            },
          ]}
          price={el?.datas?.wadge}
          color={el?.datas?.status}
          badge={{
            title: el?.metadatas?.title,
            icon: ENUMS.courts?.[el?.datas?.specification]?.badge,
          }}
          style={"mx-10 mx-auto   mb-20 h-fit "}
          key={v4()}
          url={`/works/mission/${el?.datas?.missionID}`}
          title={
            <>
              <Link className="hover:text-info mx-auto"></Link>
              {el?.datas?.status === 0 && (
                <span className="flex absolute top-3 right-1 items-center text-xs mx-auto text-white/90">
                  {el?.datas?.wadge}
                  <Icon icon={icfyETHER} className="mr-1 text-3xl" />
                </span>
              )}
              <MyStatus
                status={el?.datas?.status}
                style={"mx-auto my-1"}
                target={"feature"}
              />
            </>
          }
          setter={
            el?.datas?.status === 0
              ? () => _apiPost("askToJoin", [el?.featureID])
              : null
          }
          btn={
            el?.datas?.status === 0 && cv && cv != el?.datas?.owner
              ? "Ask to join"
              : null
          }
          header={{
            icon: ENUMS.courts?.[el?.datas?.specification]?.badge,
            title: el?.metadatas?.title,
            component: <MissionName id={el?.datas?.missionID} />,
          }}
          main={{
            text: el?.metadatas?.description,
          }}
        >
          <div className="w-full flex flex-col text-justify items-start">
            <MissionName id={el?.datas?.missionID} style={"text-xs mb-2"} />
            <p className="line-clamp-6">{el?.metadatas?.description}</p>
          </div>
        </MyCardPrice>
      ))}
    </div>
  );
};
