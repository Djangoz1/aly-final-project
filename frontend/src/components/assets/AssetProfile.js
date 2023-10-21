import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { BtnFollow } from "components/btn/BtnsSocial/BtnFollow";
import { CVName } from "components/inputs/inputsCV/CVName";
import { BtnGb1, BtnGr1 } from "components/myComponents/btn/MyGradientButton";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyFunMenus } from "components/myComponents/menu/MyFunMenus";
import { Avatar } from "components/profile/ProfileAvatar";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { useAuthState } from "context/auth";
import {
  doStateMissionTools,
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useInView } from "framer-motion";
import {
  icfy,
  icfyARROWD,
  icfyETHER,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
} from "icones";
import Link from "next/link";
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

export const AssetFreelancer = ({ owner, style }) => {
  let [isImages, setIsImages] = useState(null);
  let [isPointerImg, setIsPointerImg] = useState(0);
  useEffect(() => {
    if (!isImages && owner?.metadatas) {
      let images = [];
      owner?.metadatas?.image && images.push(owner?.metadatas?.image);
      owner?.metadatas?.attributes?.[0]?.banniere &&
        images.push(owner?.metadatas?.attributes?.[0]?.banniere);
      setIsImages(images);
    }
  }, [owner?.metadatas]);

  let handleChangeImage = (value) => {
    if (value > isImages.length - 1) {
      setIsPointerImg(0);
    } else if (value < 0) {
      setIsPointerImg(isImages.length - 1);
    } else {
      setIsPointerImg(value);
    }
  };
  return (
    <MyCard
      styles={` overflow-hidden  h-[430px] min-h-[430px] w-[300px] ${style}`}
    >
      <div className=" absolute h-1/2 top-0 left-0 w-full   flex flex-col">
        <div className="mt-auto bg-gradient-to-br px-5 from-black/10  via-black/20 to-black/30 transition-all backdrop-blur-none hover:backdrop-blur-xl  flex relative flex-col z-10">
          <CVName
            styles="text-xl"
            cvID={owner?.cvID}
            metadata={owner?.metadatas}
          />

          <p className="text-xs">{owner?.metadatas?.description}</p>
          <span className="badge -mb-3 mt-1 badge-outline bg-white shadow1 text-black py-1 px-2 h-fit badge-xs ">
            {owner?.details?.wadge?.toFixed(4)} ETH
          </span>
        </div>

        <ImagePin
          style={"absolute left-0 z-0 top-0 h-full w-full h-full"}
          CID={isImages?.[isPointerImg]}
        />
        <Icon
          onClick={() => handleChangeImage(isPointerImg - 1)}
          icon={icfyARROWD}
          className="absolute left-1  top-1/2 -translate-y-1/2 rotate-90 text-white text-4xl transition-all cursor-pointer hover:scale-110"
        />
        <Icon
          onClick={() => handleChangeImage(isPointerImg + 1)}
          icon={icfyARROWD}
          className="absolute right-1 top-1/2 -translate-y-1/2 -rotate-90 text-white text-4xl transition-all cursor-pointer  hover:scale-110 "
        />
        <MyStatus
          style={"absolute top-3 bg-white shadow1 py-1 px-3 left-3 z-1"}
          target={"visibility"}
          status={owner?.metadatas?.attributes?.[0]?.visibility ? 0 : 1}
        />
        <div
          className="
        bg-zinc-900 rounded-full absolute  -top-1 z-3 -right-1"
        >
          <BtnFollow
            cvID={owner?.cvID}
            follow={<Icon icon={icfy.person.check} />}
            unfollow={<Icon icon={icfy.person.uncheck} />}
            style={" text-xl"}
          />
        </div>
      </div>
      <div className="absolute bottom-0 h-1/2 flex flex-col pt-10 pb-4 left-0 w-full px-2 ">
        <h6 className="text-xl capitalize flex items-center">
          <Icon
            icon={ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.icon}
            className={
              "text-3xl mr-2 text-" +
              ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.color
            }
          />
          {ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.name}
        </h6>
        <div className="flex overflow-y-scroll mt-5 hide-scrollbar pb-3 flex-wrap w-full ">
          {owner?.details?.badges?.map(
            (el, i) =>
              i < 5 && (
                <div
                  key={v4()}
                  className="shadow1 rounded-full bg-white/10 text-white flex mr-3 mb-4 items-center relative text-[9px] px-4 py-1 "
                >
                  {i !== 4 ? (
                    <>
                      <Icon
                        icon={ENUMS.courts[el].badge}
                        className="mr-1 text-lg"
                      />
                      {ENUMS.courts[el].court}
                      <Icon
                        icon={icfy.ux.medal}
                        className="absolute top-0 right-0 text-xs"
                      />
                    </>
                  ) : (
                    "... More"
                  )}
                </div>
              )
          )}
          {owner?.metadatas?.attributes?.[0]?.skills?.map(
            (el, i) =>
              owner.details.badges.length + i < 5 && (
                <div
                  key={v4()}
                  className="shadow1 rounded-full bg-white/10 text-white flex mr-3 mb-4 items-center relative text-[9px] px-4 py-1 "
                >
                  {owner.details.badges.length + i !== 4 ? (
                    <>
                      <Icon
                        icon={ENUMS.courts[el].badge}
                        className="mr-1 text-lg"
                      />
                      {ENUMS.courts[el].court}
                    </>
                  ) : (
                    "... More"
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </MyCard>
  );
};

export const AssetProfileCard = () => {
  let dispatch = useToolsDispatch();
  let { cv, state } = useToolsState();
  return (
    <MyFunMenus
      menus={[
        {
          height: "65%",
          width: "70%",
          component: (
            <>
              <Icon icon={icfyFB} />
            </>
          ),
        },

        {
          height: "45%",
          width: "50%",
          component: (
            <>
              <Icon icon={icfyLINKEDIN} />
            </>
          ),
        },
        {
          height: "25%",
          width: "30%",
          component: (
            <>
              <Icon icon={icfyGITHUB2} />
            </>
          ),
        },
      ]}
      top={
        cv &&
        cv != state?.owner?.cvID && (
          <BtnFollow
            refresh={() => doStateMissionTools(dispatch, missionID)}
            follow={<Icon icon={icfy.person.add} className="c2 text-2xl " />}
            unfollow={
              <Icon icon={icfy.person.uncheck} className=" text-2xl " />
            }
            cvID={state?.owner?.cvID}
          />
        )
      }
      bottom={
        <div className="stats_profile font2 flex justify-between w-full ">
          <div className="shadow1 text-zinc-400">
            <Icon icon={icfy.person.friend} className="mr-2 text-white" />
            {state?.owner?.datas?.followers}
          </div>
          <div className="shadow1 text-zinc-400">
            <Icon icon={icfy.person.team} className="mr-2 text-white" />

            {state?.owner?.datas?.follows}
          </div>

          <div className="shadow1 text-zinc-400">
            <Icon icon={icfy.msg.chat} className="mr-2 text-white" />
            {state?.owner?.datas?.pubs}
          </div>
        </div>
      }
    >
      <div className="flex w-full  text-xs flex-col">
        <Avatar CID={state?.owner?.metadatas?.image} />
        <CVName
          styles={"mt-2 mb-1"}
          metadata={state?.owner?.metadatas}
          cvID={state?.owner?.cvID}
        />
        <p className="text-[10px] text-zinc-400">
          {state?.owner?.metadatas?.description}
        </p>
      </div>
    </MyFunMenus>
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
