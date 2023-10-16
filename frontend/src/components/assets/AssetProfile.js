import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { BtnGb1, BtnGr1 } from "components/myComponents/btn/MyGradientButton";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { Avatar } from "components/profile/ProfileAvatar";
import { ENUMS } from "constants/enums";
import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useInView } from "framer-motion";
import { icfy, icfyETHER } from "icones";
import React, { useEffect, useRef, useState } from "react";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import {
  findObjectByID,
  stateCV,
  stateDetailsCV,
} from "utils/ui-tools/state-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";
import { useAccount } from "wagmi";

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
              <div className="text-white/10 my-2">Wadge average</div>
              <p className="flex items-center  mb-2">
                <Icon icon={icfyETHER} className="text-lg mr-2" />
                {isElement?.details?.wadge} ETH
              </p>

              <div className="text-white/10 my-2">Speciality</div>
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

export const AssetProfile1 = ({
  cvID,
  metadatas,
  datas,
  noBtn,
  target,
  color,
  style,
}) => {
  let [isFollow, setIsFollow] = useState(null);
  let [isFollower, setIsFollower] = useState(null);
  let { isConnected } = useAccount();
  let { state, pointer } = useToolsState();

  let checkFollow = async () => {
    setIsFollow(await _apiGet("isFollow", [cv, cvID]));
    setIsFollower(await _apiGet("isFollow", [cvID, cv]));
  };

  useEffect(() => {
    if (
      cv > 0 &&
      parseInt(state?.owner?.cvID) > 0 &&
      cv != parseInt(state?.owner?.cvID) &&
      !isFollow &&
      !isFollower
    )
      checkFollow();
  }, [state?.owner?.cvID]);

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
      if (target && state) {
        let _state = state;
        _state[target] = element;
        doStateTools(dispatch, _state, pointer);
      }
      return element;
    }
  };

  useEffect(() => {
    if (cvID != state?.[target]?.cvID) {
      fetch();
    } else if (metadatas && datas) {
      setIsElement({ metadatas, datas });
    } else if (isElement === null && isInView && target && !state?.[target]) {
      fetch();
      console.log("Asset profile change state " + target);
    } else if (state?.[target] && isInView) {
      if (isInView && cvID == state?.[target].cvID && !isElement?.cvID) {
        setIsElement(state?.[target]);
      } else if (cvID != state?.[target].cvID) {
        fetch();
        console.log("Change state" + target);
      }
    }
  }, [cvID, metadatas, datas, isInView]);
  let setFollow = async (followFunc) => {
    if (cv !== state?.owner?.cvID) {
      let hash = await _apiPost(followFunc, [parseInt(state?.owner?.cvID)]);
      doStateProfileTools({ dispatch, cvID: state?.owner?.cvID });
      checkFollow();
    }
  };

  return (
    <div ref={ref} className={style + " backdrop-blur relative min-w-[200px]"}>
      {cv != cvID && isConnected && (
        <button
          onClick={() => setFollow(isFollow ? "unfollowCV" : "followCV")}
          className="btn btn-xs btn-outline absolute top-0 right-0 text-[10px]"
        >
          {!isFollow ? "Follow" : "Unfollow"}
        </button>
      )}
      <Avatar style={"mx-auto w-16"} CID={isElement?.metadatas?.image} />
      <div className=" w-full text-center">
        <CVName
          styles={" text-center  "}
          cvID={cvID}
          metadata={isElement?.metadatas}
        />
        {isFollower && <p className="text-xs text-white/40">Vous suit</p>}
      </div>

      <div className=" flex justify-evenly text-xs">
        <div className="flex flex-col w-1/3">
          <div className="text-white/10 my-2">Followers</div>

          {isElement?.datas?.followers}
        </div>

        <div className="flex flex-col text-center w-1/3">
          <div className="text-white/10 my-2">Follows</div>
          {isElement?.datas?.follows}
        </div>
        <div className="flex flex-col justify-start text-right w-1/3">
          <div className="text-white/10 my-2">Posts</div>
          {isElement?.datas?.pubs}
        </div>
      </div>
    </div>
  );
};
