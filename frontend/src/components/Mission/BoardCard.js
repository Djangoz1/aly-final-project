import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyCard } from "components/myComponents/MyCard";
import { MyTable } from "components/myComponents/table/MyTable";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { ENUMS } from "constants/enums";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import { icfy } from "icones";
import React, { useEffect, useState } from "react";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const BoardCard = () => {
  const { missionID, features, mission, owner } = useMissionState();
  const state = useMissionState();

  let [isClicked, setIsClicked] = useState(0);
  const dispatch = useMissionDispatch();
  let [isList, setIsList] = useState(null);
  let [isBadges, setIsBadges] = useState(null);
  const fetchInvites = () => {
    let list = [];
    let badges = [];

    for (let index = 0; index < features?.length; index++) {
      const feature = features[index];
      if (!badges[feature.datas.specification]?.counter > 0) {
        badges[feature.datas.specification] = {
          counter: 1,
          value: parseFloat(feature?.datas?.wadge),
          icon: ENUMS.courts[feature.datas.specification].badge,
        };
      } else {
        badges[feature.datas.specification] = {
          counter: badges[feature.datas.specification].counter + 1,
          value:
            badges[feature.datas.specification].value +
            parseFloat(feature?.datas?.wadge),
          icon: ENUMS.courts[feature.datas.specification].badge,
        };
      }

      if (feature.details.workerDemand.length > 0)
        for (
          let index = 0;
          index < feature?.details?.workerDemand?.length;
          index++
        ) {
          let workerID = feature?.details?.workerDemand[index];
          list.push({
            id: parseInt(workerID),
            arr: [
              <>{feature?.metadatas?.title}</>,
              <>
                <CVName cvID={workerID} />
              </>,
            ],
            btns: (
              <>
                <div className="flex mx-auto ">
                  <button className="btn px-1 btn-ghost">
                    <Icon
                      icon={icfy.ux.garbage}
                      className="text-error  text-2xl "
                    />
                  </button>
                  <button
                    onClick={async () => {
                      await _apiPost("signWorker", [
                        feature?.featureID,
                        workerID,
                      ]);
                      doStateMission(dispatch, missionID);
                      fetchInvites();
                    }}
                    className="btn px-1 btn-ghost"
                  >
                    <Icon
                      icon={icfy.ux.check}
                      className="text-success text-2xl"
                    />
                  </button>
                </div>
              </>
            ),
          });
        }
    }
    setIsList(list);

    badges = badges.filter((el) => el?.counter > 0);
    setIsBadges(badges);
  };
  useEffect(() => {
    fetchInvites();
  }, [features?.length]);

  let menus = ["Owner", "Jobs proposition", "Technologies"];

  return (
    <MyCard styles={"w-[30vw] h-[50vh] overflow-y-scroll"} icon={icfy.msg.chat}>
      <h6 className="text-white text-lg items-center mb-3 flex">
        <Icon icon={icfy.ux.checkList} className="text-xl mr-2" /> Board
      </h6>
      <div className="flex w-full rounded-full bg-white/10 mb-5">
        {menus.map((el, i) => (
          <button
            key={v4()}
            onClick={() => setIsClicked(i)}
            className={`w-1/3 btn rounded-full font2 normal-case  btn-xs ${
              i === isClicked ? "btn-warning" : "btn-ghost"
            }`}
          >
            {el}
          </button>
        ))}
      </div>
      {isClicked === 0 && (
        <div className="flex flex-col">
          <ProfileAvatar
            component={
              <p className="text-xs ">
                {owner?.attributes?.[0]?.identity?.email}
              </p>
            }
            metadatas={owner}
            cvID={mission?.datas?.owner}
          />
          <div className="border border-t-1 mt-4 border-white/10 border-b-0 py-2 border-x-0">
            <h6 className="text-white">Description</h6>

            <p className="text-xs text-justify">
              {mission?.metadatas?.description}
            </p>
          </div>
        </div>
      )}
      {isClicked === 1 && <MyTable list={isList} head={["Job", "Worker"]} />}
      {isClicked === 2 && (
        <div className="flex flex-wrap w-fit mx-auto">
          {isBadges?.map((el) => (
            <div className="relative w-fit flex mr-5 mt-4 items-center flex-col">
              <Icon icon={el.icon} className=" text-4xl" />
              <div className="badge badge-xs badge-primary absolute top-0 -right-1">
                {el?.counter}
              </div>
              <p className="text-xs mt-3 text-white">{el?.value} ETH</p>
            </div>
          ))}
        </div>
      )}
    </MyCard>
  );
};
