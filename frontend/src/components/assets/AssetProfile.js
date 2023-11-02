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
      <div className="flex items-center">
        <ImagePin
          styleImg={"w-[48px] h-[48px] mask-squircle mask "}
          CID={isElement?.metadatas?.image}
        />
        <CVName
          cvID={isElement?.cvID}
          styles={"font-bold uppercase text-lg"}
          metadata={isElement?.metadatas}
        />
      </div>
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
      owner?.metadatas?.attributes[0].cvImg &&
        images.push(owner?.metadatas?.attributes?.[0]?.cvImg);
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
      styles={`relative  flex items-end h-[430px] min-h-[430px] w-[300px] ${style}`}
    >
      <div className="absolute   h-1/2 top-0 left-0 w-full   flex flex-col">
        <div className="mt-auto bg-gradient-to-br px-5 from-black/10  c3  via-black/20 to-black/30 transition-all backdrop-blur-none hover:backdrop-blur-xl  flex relative flex-col z-10">
          <CVName
            styles="text-xl"
            cvID={owner?.cvID}
            metadata={owner?.metadatas}
          />

          <p className="text-xs">{owner?.metadatas?.description}</p>
          <div className="flex -mb-3 mt-1">
            <span className="rounded-lg    bg-lime-300 shadow c1 font-semibold py-1 px-2 h-fit w-fit text-xs ">
              {owner?.details?.wadge?.toFixed(4)} ETH
            </span>
            <span className="rounded-lg  ml-3 flex items-center   bg1 shadow c3 font-semibold py-1 px-2 h-fit w-fit text-xs ">
              <Icon
                icon={
                  ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.icon
                }
                className={
                  " mr-2 text-" +
                  ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.color
                }
              />
              {ENUMS.domain[owner?.metadatas?.attributes?.[0]?.domain]?.name}
            </span>
          </div>
        </div>

        <ImagePin
          style={"absolute left-0 z-0 top-0 h-full w-full h-full"}
          CID={isImages?.[isPointerImg]}
        />
        <Icon
          onClick={() => handleChangeImage(isPointerImg - 1)}
          icon={icfyARROWD}
          className="absolute left-1  top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 rotate-90 text-white text-4xl transition-all cursor-pointer hover:scale-110"
        />
        <Icon
          onClick={() => handleChangeImage(isPointerImg + 1)}
          icon={icfyARROWD}
          className="absolute right-1 top-1/2 -translate-y-1/2 -rotate-90 opacity-50 hover:opacity-100 text-white text-4xl transition-all cursor-pointer  hover:scale-110 "
        />
        <MyStatus
          style={`absolute top-3  py-1  px-2 text-xs left-3 z-1 `}
          target={"visibility"}
          status={owner?.metadatas?.attributes?.[0]?.visibility ? 0 : 1}
        />
        <div
          className="
        bg-black/20 backdrop-blur rounded-full absolute  -top-2 z-3 -right-2"
        >
          <BtnFollow
            cvID={owner?.cvID}
            follow={<Icon icon={icfy.person.check} />}
            unfollow={<Icon icon={icfy.person.uncheck} />}
            style={" text-xl px-3 backdrop-blur-xl bg-black/60"}
          />
        </div>
      </div>
      <div className=" bottom-0 h-1/2 flex flex-col pt-10 pb-4 left-0 w-full px-2 ">
        <div className="flex overflow-y-scroll  hide-scrollbar pb-3 flex-wrap w-full ">
          {owner?.details?.badges?.map(
            (el, i) =>
              i < 5 && (
                <div
                  key={v4()}
                  className="backdrop-blur  rounded-full bg-white/10 text-white flex mr-3 mb-4 items-center relative text-[10px] px-4 py-1 "
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
                  className="backdrop-blur rounded-full bg-white/10 text-white flex mr-3 mb-4 items-center relative text-[10px] px-4 py-1 "
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
