import React, { useEffect, useState } from "react";

import { statePub } from "utils/ui-tools/state-tools";

import { CVName } from "components/inputs/inputsCV/CVName";
import { ImagePin } from "components/Image/ImagePin";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { Icon } from "@iconify/react";
import { icfy, icfyBUBBLE, icfyHEART, icfyMISSION } from "icones";
import { MyModal } from "components/myComponents/modal/MyModal";
import { LogoIc } from "components/Logo";
import { fromTimestamp } from "utils/ux-tools";
import Link from "next/link";
import { useAccount } from "wagmi";
import { CreatePub } from "sections/Pub/form/create/CreatePub";

export const Pub = ({ id, styles, _owner, modal }) => {
  const [isDatas, setIsDatas] = useState(null);
  let [isClicked, setIsClicked] = useState(null);
  let { isConnected, address } = useAccount();
  const state = async () => {
    const pub = await statePub(id);
    let owner;
    if (!_owner) {
      let uriOwner = await _apiGet("tokenURIOf", [
        pub?.owner,
        ADDRESSES["cvsHub"],
      ]);
      owner = await fetchJSONByCID(uriOwner);
    } else {
      owner = _owner;
    }
    let likers = [];
    if (pub?.datas?.likes > 0) {
      let likes = await _apiGet("indexerOfToken", [
        id,
        ADDRESSES["pubsDatasHub"],
      ]);
      for (let index = 0; index < likes?.length; index++) {
        const likeID = likes?.[index];
        likers.push(
          await _apiGet("ownerOfToken", [likeID, ADDRESSES["pubsDatasHub"]])
        );
      }
    }
    setIsDatas({ pub, owner, likers });
  };

  useEffect(() => {
    if (!isDatas && id) {
      state();
    }
  }, [id]);

  let setterLike = async (func) => {
    if (isConnected) {
      await _apiPost(func, [id]);
      state();
    }
  };

  return (
    <div
      className={
        "flex border border-t-0 border-b-1 border-white/10 hover:bg-black/20 hover:text-white border-x-0  px-4 py-5  items-start"
      }
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
          {fromTimestamp(isDatas?.pub?.metadata?.attributes?.[0]?.createdAt)}
        </span>
      </div>

      <div className="flex h-max  border border-l-1 border-white/10 border-y-0 border-r-0  px-5 flex-col ml-5 ">
        <CVName
          styles={"text-white/40  mb-3 font-semibold text-sm"}
          metadata={isDatas?.owner}
          cvID={isDatas?.pub?.owner}
        />

        <p
          className={`text-[${styles?.size}] line-clamp-${
            isClicked ? "none" : styles?.clamp
          } cursor-pointer whitespace-pre-line text-justify`}
          onClick={() => setIsClicked(!isClicked)}
        >
          {isDatas?.pub?.metadata?.description}
        </p>

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
            <CreatePub
              btn={
                <>
                  <Icon icon={icfyBUBBLE} className=" mr-1" />
                  {parseInt(isDatas?.pub?.datas?.answers)}
                </>
              }
              styles={`flex btn btn-ghost btn-xs py-2 h-fit w-fit hover:text-secondary cursor-pointer ${
                !isConnected && "btn-disabled"
              }`}
              answerID={id}
            />

            <button
              disabled={!isConnected}
              className={`flex btn btn-ghost btn-xs py-2 h-fit w-fit   cursor-pointer ${
                !isDatas?.likers?.includes(address)
                  ? "hover:text-secondary"
                  : "text-secondary hover:text-error"
              }`}
              onClick={() =>
                setterLike(
                  !isDatas?.likers?.includes(address) ? "likePub" : "unlikePub"
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
  );
};
