import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { useAuthState } from "context/auth";
import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useState } from "react";
import { MyBigBtn } from "./MyBigBtn";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { MyModal } from "components/modal/MyModal";
import { EditProfile } from "components/modal/works/EditProfile";
import { styles } from "styles/style";

export const MyHeader = ({
  img,
  ownerID,
  name,
  desc1,
  desc2,
  stats,
  details,
  menus,
}) => {
  let cvID = ownerID;

  const currentUrl = window ? window?.location?.pathname : null;

  let { cv } = useAuthState();

  return (
    <div className="flex flex-col w-full">
      <div
        className={
          "flex relative flex-col w-full pb-5  justify-center text-center border border-b-1 border-white/10 border-x-0 border-t-0 "
        }
      >
        <div className="flex flex-col">
          <div className="avatar h-fit">
            <ImagePin
              style={"rounded-full   border-zinc-800 border border-3 w-20"}
              CID={img}
            />
          </div>
          {cv == cvID && cv ? (
            <EditProfile styles={`absolute right-3 top-3  ${styles.btn}`} />
          ) : (
            <button className="absolute right-3 top-3 btn btn-xs btn-outline btn-primary w-fit mx-auto mt-2 capitalize">
              Follow
            </button>
          )}

          <div className="flex font2  items-start my-5 flex-col">
            <p className={"text-white  text-lg"}>{name || "No name"}</p>
            <p className={" text-xs"}>{desc1 || "No description"}</p>
            <div
              className={
                " flex flex-col text-sm text-white text-left items-start"
              }
            >
              {desc2}
            </div>
          </div>
          <div className="flex w-full">
            {stats?.map((el) => (
              <MyBigBtn
                key={uuidv4()}
                title={el?.title}
                value={el?.value}
                icon={el?.icon}
                style={`${el?.theme} mr-4`}
              />
            ))}
          </div>
          {/* <ProfileBtns stats={[0, 0, 0, 0]} /> */}
          <div className="flex w-full items-center mt-3">
            {details?.map((el) => (
              <p className="mr-4 text-sm" key={uuidv4()}>
                <span className="text-white mr-1">{el?.value || 0}</span>
                {el?.title}
              </p>
            ))}

            <div className="ml-auto flex">
              <Icon icon={icfyGITHUB2} className="text-[29px] mr-3" />
              <Icon icon={icfyLINKEDIN} className="text-[29px] mr-3" />
              <Icon icon={icfyFB} className="text-[29px] mr-3" />
              <Icon icon={icfyTWITTER} className="text-[29px] mr-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex  border border-b-1 border-t-0 border-x-0 border-white/10 w-full">
        {menus?.map((menu) =>
          !menu?.component ? (
            <Link
              key={uuidv4()}
              className={`font2 ${
                menu?.style || ""
              } font-light text-xs transition-all py-5 px-5 ${
                currentUrl === menu?.link
                  ? "border-b-2 border border-t-0 border-x-0 border-secondary bg-black/40 text-white"
                  : "opacity-60"
              }`}
              href={menu?.link}
            >
              {menu?.title}
            </Link>
          ) : (
            <div className={`${menu?.style} my-auto  h-fit`}>
              {menu?.component}
            </div>
          )
        )}
      </div>
    </div>
  );
};
