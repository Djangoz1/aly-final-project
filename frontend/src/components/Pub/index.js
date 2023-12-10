import React, { useEffect, useRef, useState } from "react";

import { statePub } from "utils/ui-tools/state-tools";

import { CVName } from "components/links/CVName";
import { ImagePin } from "components/Image/ImagePin";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { clientPocket, fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { Icon } from "@iconify/react";
import { icfy, icfyBUBBLE, icfyHEART, icfyMISSION, icfySEND } from "icones";
import { MyModal } from "components/myComponents/modal/MyModal";
import { LogoIc } from "components/Logo";
import { fromTimestamp } from "utils/ux-tools";
import Link from "next/link";
import { useAccount } from "wagmi";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CodeEditor } from "components/myComponents/MyEditor";
import { ENUMS } from "constants/enums";
import { useInView } from "framer-motion";
import { v4 } from "uuid";
import {
  doStateIndexerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useAuthState } from "context/auth";
import { MyNum } from "components/myComponents/text/MyNum";
import { Avatar } from "components/profile/ProfileAvatar";
import { controllers } from "utils/controllers";

export const Pub = ({ id, _pub, styles, bools, _owner, modal, color }) => {
  const [isDatas, setIsDatas] = useState(null);

  console.log("------", _pub);
  let [isClicked, setIsClicked] = useState(null);
  let { isConnected, address } = useAccount();
  let ref = useRef(null);
  let isInView = useInView(ref);
  let { cv, metadatas } = useAuthState();
  let tools = useToolsState();
  let { indexer } = useToolsState();
  let dispatch = useToolsDispatch();

  const state = async () => {
    if (_pub && _owner) {
      let isLiked = await controllers.get.likes.item({
        userID: metadatas?.id,
        postID: _pub?.metadatas?.id,
      });
      setIsDatas({
        likes: await controllers.get.likes.list({
          postID: _pub?.metadatas?.id,
        }),
        isLiked: isLiked ? true : cv ? false : undefined,
      });
    }
  };

  console.log(isDatas);

  useEffect(() => {
    if (
      (isDatas === null && isInView) ||
      (isDatas?.isLiked === undefined && metadatas?.id && isInView)
    ) {
      state();
    }
  }, [metadatas, isInView, _pub]);

  let setterLike = async () => {
    if (isConnected) {
      let _datas = {
        userID: metadatas?.id,
        postID: _pub?.metadatas?.id,
      };
      await controllers.create.like(_datas);

      state();
    }
  };

  return (
    <>
      <div
        id={`pub${id}`}
        ref={ref}
        className={`flex border  _hover   border-t-0 border-b-1 ${
          [
            "border-white/10 hover:bg-black/20 hover:text-white",
            "bc1  hover:bg-neutral-400 bg3 hover:text-sky-950",
          ]?.[color || 0]
        } border-x-0  px-4 py-5  w-full items-start`}
      >
        <Avatar metadatas={_owner} CID={_owner?.avatar} style={`w-12`} />

        <div className={`flex h-max  w-full px-5 flex-col  `}>
          <div className=" flex c4 items-center mb-1">
            <CVName
              styles={`${
                ["c3 ", "c1"]?.[color || 0]
              } mr-2 font-semibold text-sm`}
              metadata={_owner}
              cvID={_owner?.cvID}
            />
            <Icon
              icon={icfy.social.checkmark}
              className="text-sky-500 text-sm"
            />
            <span className={` text-[8px] ml-2  whitespace-nowrap  `}>
              • {fromTimestamp(_pub?.metadatas?.created)}
            </span>
          </div>

          {!_pub?.metadatas?.code ? (
            <p
              className={`text-sm mt-1 line-clamp-${
                isClicked ? "none" : styles?.clamp
              } cursor-pointer whitespace-break-spaces ${
                ["text-slate-700 dark:text-slate-400", "c1"]?.[color || 0]
              } text-justify`}
              onClick={() => setIsClicked(!isClicked)}
            >
              {_pub?.metadatas?.description}
            </p>
          ) : (
            <>
              {_pub?.metadatas?.title && (
                <h6 className="flex mb-2 items-center">
                  <Icon
                    icon={ENUMS?.courts?.[_pub?.metadatas?.language]?.badge}
                    className="mr-5 text-2xl"
                  />{" "}
                  {_pub?.metadatas?.title}{" "}
                </h6>
              )}
              <CodeEditor
                style={"fit-editor"}
                onClick={() => setIsClicked(!isClicked)}
                value={_pub?.metadatas?.description}
              ></CodeEditor>
            </>
          )}

          {_pub?.metadatas?.image && (
            <MyModal
              styles={{ btn: "ghost btn-ghost w-fit p-0 my-5" }}
              btn={
                <div className="w-[55px]">
                  <ImagePin CID={_pub?.metadatas?.image} />
                </div>
              }
              modal={
                <div className="w-fit">
                  <ImagePin CID={_pub?.metadatas?.image} style={"w-full"} />
                </div>
              }
            />
          )}
          <div className="flex gap-4  mt-10 items-center">
            <button
              onClick={() =>
                doStateIndexerTools(dispatch, {
                  ...indexer,
                  indexPub: {
                    ...indexer?.indexPub,
                    id: id,
                    answer:
                      id !== indexer?.indexPub?.id
                        ? true
                        : !indexer?.indexPub?.answer,
                  },
                })
              }
              className={`flex border border-white/5 bg-gradient-to-l from-white/5 to-transparent text-[9px] normal-case btn btn-ghost btn-xs py-2 h-fit w-fit   cursor-pointer`}
            >
              <Icon icon={icfyBUBBLE} className="text-lg " />
              {/* Answers */}
              <MyNum
                toFix={0}
                num={_pub?.metadatas?.answers?.length}
                style=" border-2 border-l-white/10 border-white/0 pl-2 "
              ></MyNum>
            </button>

            <button
              disabled={!cv}
              className={`flex border border-white/5 bg-gradient-to-l from-white/5 to-transparent text-[9px] normal-case btn btn-ghost btn-xs py-2 h-fit w-fit   cursor-pointer ${
                _pub?.metadatas?.likes?.filter(
                  (el) => el?.userID == metadatas?.id
                )?.[0]
                  ? "hover:text-error"
                  : "hover:text-success"
              }`}
              onClick={() => setterLike()}
            >
              {isDatas?.isLiked ? (
                <>
                  <Icon icon={icfy.like} className="text-lg text-success  " />

                  {/* Liked */}
                </>
              ) : (
                <>
                  <Icon icon={icfy.like} className="text-lg  " />

                  {/* Likes */}
                </>
              )}
              <MyNum
                toFix={0}
                num={isDatas?.likes}
                style=" border-2 border-l-white/10 border-white/0 pl-2 "
              ></MyNum>
            </button>

            <button
              className="ml-auto mr-3"
              disabled={!cv}
              onClick={() =>
                doStateIndexerTools(dispatch, {
                  ...tools?.indexer,

                  indexPub: {
                    id: id,
                    post:
                      id !== tools?.state?.front?.indexPub?.id
                        ? true
                        : !tools?.state?.front?.indexPub?.post,
                  },
                })
              }
            >
              <Icon icon={icfySEND} className="text-lg " />
            </button>
            {_pub?.metadatas?.missionID ? (
              <Link
                // className="ml-auto"
                href={
                  _pub?.metadatas?.missionID
                    ? `/mission/${_pub?.datas?.missionID}`
                    : "#"
                }
              >
                <Icon icon={icfy.ux.mediation} className={"cursor-pointer"} />
              </Link>
            ) : (
              <></>
            )}
          </div>
          {indexer?.indexPub?.id === id && indexer?.indexPub?.post === true && (
            <CreatePub
              btn={<></>}
              refresh={state}
              styles={`flex btn btn-ghost btn-xs py-2 h-fit w-fit hover:text-secondary cursor-pointer ${
                !isConnected && "btn-disabled"
              }`}
              answerID={_pub?.metadatas?.id}
            />
          )}
        </div>
      </div>
      {indexer?.indexPub?.id === id &&
        indexer?.indexPub?.answer === true &&
        _pub?.metadatas?.answers?.map((el) => (
          <>
            <Pub
              key={v4()}
              _pub={{ metadata: el }}
              color={1}
              styles={"bg-white c1 "}
              id={el}
            />
          </>
        ))}
    </>
  );
};
