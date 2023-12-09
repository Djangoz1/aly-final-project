import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect, useState } from "react";
import { MyBigBtn } from "./MyBigBtn";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

export const MyHeader = ({
  path,
  img,
  name,
  desc1,
  desc2,
  stats,
  details,
  menus,
  btn,
}) => {
  return (
    <div className="flex flex-col mb-8 w-full">
      <div
        className={
          "flex relative flex-col w-full pb-5  justify-center text-center border border-b-1 border-white/10 border-x-0 border-t-0 "
        }
      >
        <div className="flex relative flex-col">
          <div className="avatar h-fit">
            <ImagePin
              style={
                "mask mask-squircle   border-zinc-800 border border-3 w-24"
              }
              CID={img}
            />
          </div>

          <div className="flex font2 relative items-start mt-2 mb-5 flex-col">
            <p className={"text-white  text-lg"}>{name || "No name"}</p>
            <div className={" text-xs"}>{desc1 || "No description"}</div>
            <div
              className={
                " flex flex-col text-sm text-white text-left items-start"
              }
            >
              {desc2}
            </div>
            {btn}
          </div>
          <div className="flex w-full">
            {!stats?.component
              ? stats?.map((el) => (
                  <MyBigBtn
                    key={uuidv4()}
                    title={el?.title}
                    value={el?.value}
                    icon={el?.icon}
                    style={`${el?.theme} mr-4`}
                  />
                ))
              : stats?.component}
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
          menu?.link ? (
            <Link
              key={uuidv4()}
              className={`font2 ${
                menu?.style || ""
              } font-light text-xs transition-all hover:text-white py-5 px-5 ${
                path === menu.link &&
                "border-b-2 border border-t-0 border-x-0 border-secondary bg-black/40 text-white"
              }`}
              href={menu?.link}
            >
              {menu?.title}
            </Link>
          ) : (
            menu?.component && (
              <div className={`${menu?.style} my-auto  h-fit`}>
                {menu?.component}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};
