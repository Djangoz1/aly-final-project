import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCard1 } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { ENUMS } from "constants/enums";
import { doIndexTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export const CVMissions = () => {
  let [isClicked, setIsClicked] = useState(0);

  let ref = useRef(null);
  let isInView = useInView(ref);

  let { state, index } = useToolsState();

  let dispatch = useToolsDispatch();
  console.log("missions state ", state?.owner?.details?.missions);
  // useEffect(() => {
  //     if (isInView && !state?.features && state?.datas?.features?.length > 0) {

  //     }
  // }, [isInView])
  return (
    <>
      <div className="flex flex-col" ref={ref}>
        <div className="tabs tabs-boxed backdrop-blur  mb-1">
          {state?.owner?.details?.missions?.map((el, i) => (
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
          <MyCardInfo
            header={{
              title: (
                <MissionName
                  metadatas={
                    state?.owner?.details?.missions?.[index]?.metadatas
                  }
                  id={state?.owner?.details?.missions?.[index]?.missionID}
                />
              ),

              image: state?.owner?.details?.missions?.[index]?.metadatas?.image,
            }}
            color={1}
            styles={" w-full     "}
            noBtn={true}
            main={{
              text: state?.owner?.details?.missions?.[index]?.metadatas
                ?.description,
              title:
                ENUMS?.domain?.[
                  state?.owner?.details?.missions?.[index]?.metadatas
                    ?.attributes?.[0]?.domain
                ]?.name,
            }}
          />
        </div>
      </div>
    </>
  );
};
