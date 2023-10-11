import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { BtnGb1, BtnGr1 } from "components/myComponents/btn/MyGradientButton";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { ENUMS } from "constants/enums";
import { useAuthState } from "context/auth";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfy, icfyETHER } from "icones";
import React, { useEffect, useRef, useState } from "react";
import {
  findObjectByID,
  stateCV,
  stateDetailsCV,
} from "utils/ui-tools/state-tools";
import { v4 } from "uuid";

export const AssetProfile = ({
  cvID,
  metadatas,
  noBtn,
  target,
  color,
  style,
}) => {
  let { state, pointer } = useToolsState();
  let { cv } = useAuthState();
  let [isElement, setIsElement] = useState(null);
  const ref = useRef(null);

  const isInView = useInView(ref);

  let dispatch = useToolsDispatch();

  let fetch = async () => {
    if (cvID > 0) {
      const element = await stateCV(cvID);
      let details = await stateDetailsCV(cvID);
      element.details = details;
      setIsElement(element);
      if (target) {
        let _state = state;
        _state[target] = element;
        doStateTools(dispatch, _state, pointer);
      }
      return element;
    }
  };

  console.log("element", isElement);
  useEffect(() => {
    if (metadatas) {
      setIsElement({ metadatas });
    } else if (isElement === null && isInView && target && !state?.[target]) {
      fetch();
      console.log("Asset profile change state " + target);
    } else if (state?.[target] && isInView) {
      if (isInView && cvID == state?.[target].cvID && !isElement?.cvID) {
        setIsElement(state?.[target]);
        console.log("element Asset profile", isElement);
        console.log("Asset profile Set is Element" + target);
      } else if (cvID != state?.[target].cvID) {
        fetch();
        console.log("Change state" + target);
      }
    }
  }, [cvID, isInView]);

  return (
    <div ref={ref} className={style || " w-[23%] h-fit" + " min-w-[200px]"}>
      <MyCardInfo
        styles={"w-full h-full"}
        color={color || 1}
        header={{
          title: <CVName cvID={cvID} metadata={isElement?.metadatas} />,
          image: isElement?.metadatas?.image,
        }}
        main={{
          title: "Languages skills",
          text: (
            <>
              <div className="flex">
                {isElement?.details?.badges?.length > 0 ? (
                  isElement?.details?.badges?.map((badgeID) => (
                    <Icon
                      key={v4()}
                      icon={ENUMS.courts?.[badgeID]?.badge}
                      className="mr-3 text-lg"
                    />
                  ))
                ) : (
                  <p className="text-xs text-center ">Junior</p>
                )}
              </div>
              <div className="text-white/10 uppercase my-2">Wadge average</div>
              <p className="flex items-center  mb-2">
                <Icon icon={icfyETHER} className="text-lg mr-2" />
                {isElement?.details?.wadge} ETH
              </p>

              <div className="text-white/10 uppercase my-2">Speciality</div>
              <Icon
                className="flex items-center  capitalize mb-2"
                icon={
                  ENUMS.domain?.[isElement?.metadatas?.attributes?.[0]?.domain]
                    ?.icon
                }
              ></Icon>
            </>
          ),
        }}
        btn={
          noBtn
            ? { component: <></> }
            : isElement?.cvID != cv
            ? {
                component: (
                  <div className="flex items-center mt-2 join">
                    {isElement?.cvID !== state?.worker?.cvID && (
                      <BtnGb1
                        style={
                          "flex btn-xs w-1/2 join-item items-center text-[8px]"
                        }
                      >
                        <Icon icon={icfy.ux.mediation} className="text-xs" />
                        <p>Invite worker</p>
                      </BtnGb1>
                    )}
                    <div
                      className={
                        "flex btn-xs w-1/2 c2 btn btn-outline  join-item items-center text-[9px]"
                      }
                    >
                      <Icon
                        icon={icfy.person.friend}
                        className="mr-3 text-sm"
                      />
                      <p>Follow</p>
                    </div>
                  </div>
                ),
                style: "flex items-center justify-between",
              }
            : {
                title: "Edit profile",
              }
        }
      />
    </div>
  );
};
