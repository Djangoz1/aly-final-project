import React, { useEffect, useRef, useState } from "react";

import { statePub } from "utils/ui-tools/state-tools";

import { CVName } from "components/inputs/inputsCV/CVName";
import { ImagePin } from "components/Image/ImagePin";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
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
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useAuthState } from "context/auth";

export const Pub = ({ id, _pub, styles, bools, _owner, modal, color }) => {
  const [isDatas, setIsDatas] = useState(null);
  let [isClicked, setIsClicked] = useState(null);
  let { isConnected, address } = useAccount();
  let ref = useRef(null);
  let isInView = useInView(ref);
  let { cv } = useAuthState();
  let tools = useToolsState();
  let dispatch = useToolsDispatch();

  const state = async () => {
    if (_pub && _owner) {
      setIsDatas({ pub: _pub, owner: _owner });
    } else if (parseInt(id) > 0) {
      let pub;

      if (_pub) {
        pub = _pub;
      } else {
        pub = await statePub(id);
      }
      let owner;

      if (!_owner) {
        let uriOwner = await _apiGet("tokenURIOf", [
          pub?.owner,
          ADDRESSES["cvsHub"],
        ]);
        owner = await fetchJSONByCID({ id: uriOwner, table: "accounts" });
      } else {
        owner = _owner;
      }

      setIsDatas({ pub, owner });
    }
  };

  useEffect(() => {
    if ((!isDatas && isInView) || (isInView && id != isDatas?.pub?.pubID)) {
      state();
    }
  }, [id, _pub, isInView, _owner]);

  let setterLike = async (func) => {
    if (isConnected) {
      await _apiPost(func, [id]);
      state();
    }
  };

  return (
    ((bools && bools(isDatas?.pub)) || !bools) && (
      <>
        <div
          id={`pub${id}`}
          ref={ref}
          className={`flex border   border-t-0 border-b-1 ${
            [
              "border-white/10 hover:bg-black/20 hover:text-white",
              "bc1  hover:bg-neutral-400 bg3 hover:text-sky-950",
            ]?.[color || 0]
          } border-x-0  px-4 py-5  w-full items-start`}
        >
          <div className="flex flex-col h-full  items-center ">
            {modal && <LogoIc styles={"mb-5"} />}
            <div className="avatar">
              <ImagePin
                CID={isDatas?.owner?.image}
                style={`w-${styles?.img || "12"} mask mask-squircle `}
              />
            </div>

            <span className={`text-xs whitespace-nowrap  mt-3`}>
              {fromTimestamp(isDatas?.pub?.metadata?.created)}
            </span>
          </div>

          <div
            className={`flex h-max  border border-l-1 w-full ${
              ["border-white/10", "border-black/10"]?.[color || 0]
            } border-y-0 border-r-0  px-5 flex-col ml-5 `}
          >
            <CVName
              styles={`${
                ["text-white/40 ", "c1"]?.[color || 0]
              } mb-1 font-semibold text-sm`}
              metadata={isDatas?.owner}
              cvID={isDatas?.pub?.owner}
            />

            {!isDatas?.pub?.metadata?.code ? (
              <p
                className={`text-[${styles?.size}] line-clamp-${
                  isClicked ? "none" : styles?.clamp
                } cursor-pointer whitespace-pre-line ${
                  ["c3", "c1"]?.[color || 0]
                } text-justify`}
                onClick={() => setIsClicked(!isClicked)}
              >
                {isDatas?.pub?.metadata?.description}
              </p>
            ) : (
              <>
                {isDatas?.pub?.metadata?.title && (
                  <h6 className="flex mb-2 items-center">
                    <Icon
                      icon={
                        ENUMS?.courts?.[isDatas?.pub?.metadata?.language]?.badge
                      }
                      className="mr-5 text-2xl"
                    />{" "}
                    {isDatas?.pub?.metadata?.title}{" "}
                  </h6>
                )}
                <CodeEditor
                  style={"fit-editor"}
                  onClick={() => setIsClicked(!isClicked)}
                  value={isDatas?.pub?.metadata?.description}
                ></CodeEditor>
              </>
            )}

            {isDatas?.pub?.metadata?.image && (
              <MyModal
                styles={{ btn: "ghost btn-ghost w-fit p-0 my-5" }}
                btn={
                  <div className="w-[55px]">
                    <ImagePin CID={isDatas?.pub?.metadata?.image} />
                  </div>
                }
                modal={
                  <div className="w-fit">
                    <ImagePin
                      CID={isDatas?.pub?.metadata?.image}
                      style={"w-full"}
                    />
                  </div>
                }
              />
            )}
            {!modal && (
              <div className="flex  mt-10 items-end">
                <MyModal
                  styles={{
                    btn: "btn btn-ghost btn-xs hover:text-info py-2 h-fit w-fit",
                  }}
                  btn={<Icon icon={icfy.eye.open} />}
                  modal={
                    <Pub
                      id={id}
                      modal={true}
                      styles={{ size: "18px", clamp: "none" }}
                      _owner={isDatas?.owner}
                    />
                  }
                />
                <div className="flex w-full flex-col">
                  <div className="flex w-full justify-center items-center">
                    <Link
                      href={`#pub${id}`}
                      onClick={() =>
                        doStateTools(
                          dispatch,
                          {
                            ...tools?.state,
                            front: {
                              ...tools?.state?.front,
                              indexPub: {
                                id: id,
                                answer:
                                  id !== tools?.state?.front?.indexPub?.id
                                    ? true
                                    : !tools?.state?.front?.indexPub?.answer,
                              },
                            },
                          },
                          tools?.pointer
                        )
                      }
                      className="btn btn-xs btn-ghost"
                    >
                      <Icon icon={icfyBUBBLE} className=" mr-1" />
                      {isDatas?.pub?.datas?.answers?.length}
                    </Link>
                    <button
                      disabled={!cv}
                      href={`#pub${id}`}
                      onClick={() =>
                        doStateTools(
                          dispatch,
                          {
                            ...tools?.state,
                            front: {
                              ...tools?.state?.front,
                              indexPub: {
                                id: id,
                                post:
                                  id !== tools?.state?.front?.indexPub?.id
                                    ? true
                                    : !tools?.state?.front?.indexPub?.post,
                              },
                            },
                          },
                          tools?.pointer
                        )
                      }
                      className="btn ml-10 btn-xs btn-ghost"
                    >
                      <Icon icon={icfySEND} className=" mr-1" />
                      Post
                    </button>
                  </div>

                  {tools?.state?.front?.indexPub?.id === id &&
                    tools?.state?.front?.indexPub?.post === true && (
                      <CreatePub
                        btn={<></>}
                        styles={`flex btn btn-ghost btn-xs py-2 h-fit w-fit hover:text-secondary cursor-pointer ${
                          !isConnected && "btn-disabled"
                        }`}
                        answerID={id}
                      />
                    )}
                </div>

                <button
                  disabled={!isConnected}
                  className={`flex btn btn-ghost btn-xs py-2 h-fit w-fit   cursor-pointer ${
                    !isDatas?.likers?.includes(address)
                      ? "hover:text-secondary"
                      : "text-secondary hover:text-error"
                  }`}
                  onClick={() =>
                    setterLike(
                      !isDatas?.likers?.includes(address)
                        ? "likePub"
                        : "unlikePub"
                    )
                  }
                >
                  <Icon icon={icfyHEART} className={`text- mr-1 `} />
                  {parseInt(isDatas?.pub?.datas?.likes)}
                </button>
                {parseInt(isDatas?.pub?.datas?.missionID) > 0 ? (
                  <Link
                    className="btn btn-ghost btn-xs py-2 h-fit w-fit"
                    href={`/works/mission/${isDatas?.pub?.datas?.missionID}`}
                  >
                    <Icon
                      icon={icfyMISSION}
                      className=" text-blue-600 cursor-pointer"
                    />
                  </Link>
                ) : (
                  <button className="btn btn-ghost btn-xs py-2 h-fit w-fit">
                    <Icon icon={icfyMISSION} className="  text-red-900" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {tools?.state?.front?.indexPub?.id === id &&
          tools?.state?.front?.indexPub?.answer === true &&
          isDatas?.pub?.datas?.answers?.map((el) => (
            <Pub key={v4()} color={1} styles={"bg-white c1 "} id={el} />
          ))}
      </>
    )
  );
};
