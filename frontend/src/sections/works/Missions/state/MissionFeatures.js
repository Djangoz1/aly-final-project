import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { doIndexTools, useToolsDispatch, useToolsState } from "context/tools";
import React, { useState } from "react";
import { v4 } from "uuid";

export const MissionFeatures = () => {
  let [isClicked, setIsClicked] = useState(0);

  let { state, index } = useToolsState();

  let dispatch = useToolsDispatch();
  return (
    <>
      <div className="flex flex-col">
        <div className="tabs tabs-boxed backdrop-blur  mb-1">
          {state?.features?.map((el, i) => (
            <button
              onClick={() => doIndexTools(dispatch, i)}
              key={v4()}
              className={`  tab mr-5 btn-xs ${
                index === i ? "bg1 text-white" : " "
              }`}
            >
              {el?.metadatas?.title}
            </button>
          ))}
        </div>

        <div className="flex ">
          <AssetJob
            style={" w-full mb-1 "}
            noBtn={true}
            feature={state?.features?.[isClicked]}
            featureID={state?.features?.[isClicked]?.featureID}
          />
        </div>
        <div className="flex items-end w-full">
          <div className="">
            <div className="tabs ">
              <a className="tab tab-lifted font2 pb-5 p-2 -mb-2 tab-xs backdrop-blur   text-white ">
                Owner
              </a>
            </div>
            <AssetProfile
              noBtn={true}
              cvID={state?.features?.[isClicked]?.datas?.owner}
              target={"owner"}
            />
          </div>
          {state?.features?.[isClicked]?.datas?.cvWorker && (
            <div className="flex ml-1 flex-col">
              <div className="tabs ">
                <a className="tab tab-lifted font2 pb-5 ml-auto p-2 -mb-2 tab-xs backdrop-blur   text-white ">
                  Worker
                </a>
              </div>
              <AssetProfile
                noBtn={true}
                color={2}
                cvID={state?.features?.[isClicked]?.datas?.cvWorker}
                target={"worker"}
              />
            </div>
          )}
          <div className="ml-auto">
            {!state?.features?.[isClicked]?.datas?.cvWorker > 0 && (
              <button className="c2 btn-outline btn mr-5 btn-xs">
                Invite worker
              </button>
            )}
            <button className="c1 btn-success btn btn-xs mr-5">
              Claim wadge
            </button>
            {!state?.features?.[isClicked]?.datas?.startedAt > 0 && (
              <button className="btn-error btn btn-outline btn-xs">
                Declare contest
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
