import { Icon } from "@iconify/react";
import { icfy } from "icones";
import React from "react";
import { MySub } from "../text/MySub";
import { MyNum } from "../text/MyNum";
import { MyModal } from "../modal/MyModal";
import { MyStatus } from "../item/MyStatus";
import { MyTitle } from "../text/MyTitle";
import { v4 } from "uuid";
import Link from "next/link";

export const MyLayoutDetails = ({
  objStatus,
  btns,
  style,
  arr,
  footers,
  _size,
}) => {
  return (
    <div className={`flex ${style || ""} flex-col relative gap-3`}>
      {/* <Avatar metadatas={}/> */}
      <MyTitle style={"border-b py-5 border-white/5"}>
        Selected details{" "}
      </MyTitle>
      <div className=" mr-5 h-fit translate-y-full absolute right-0 bottom-0"></div>
      <div className="flex gap-1 flex-col">
        <MySub style={"c4"}>Status</MySub>
        <MyStatus
          padding={"px-2 py-1"}
          style={"text-[9px]"}
          status={objStatus?.status}
          target={objStatus?.target}
        />
      </div>

      <div className="flex w-full  flex-col gap-1">
        {arr?.map(
          (el) =>
            (el?.title || el?.value) && (
              <div
                key={v4()}
                className="flex w-full border border-white/5  items-center rounded-lg shadow-xl c4 hover:text-white/70 backdrop-blur gap-3 px-2 py-1 bg-white/5 hover:bg-white/10"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 ">
                  <Icon icon={el?.icon} className="text-[20px]" />
                </div>
                <div className="flex h-full justify-evenly flex-col ">
                  <MySub size={9} style={"c4 text-[7px] "}>
                    {el?.title}
                  </MySub>
                  {el?.num >= 0 ? (
                    <MyNum
                      num={el?.num}
                      style="c3 text-xs capitalize font-light"
                    >
                      {el?.value}
                    </MyNum>
                  ) : (
                    <div className="c3 text-xs capitalize font-light">
                      {el?.value}
                    </div>
                  )}
                </div>
              </div>
            )
        )}

        {btns?.map((el, i) => (
          <MyModal
            key={v4()}
            MyModal
            id={"modal-details-" + i}
            style={
              "fixed z-100 backdrop-blur-xl bg-black/30  left-0    bg-zinc-950 flex justify-center w-fit max-w-full top-20 "
            }
            btn={
              <Link
                href={el?.url || "#"}
                className="flex cursor-pointer items-center font-light text-xs flex-row w-full px-3 py-2 gap-2 border hover:bg-white/5 border-white/5 rounded-lg"
              >
                {el?.btn}
              </Link>
            }
          >
            {el?.modal}
          </MyModal>
        ))}

        {footers?.map((el) => (
          <div key={v4()} className="flex gap-1 mt-5 w-fit flex-col">
            <MySub style={"c4 mb-2"}>{el?.title}</MySub>
            {el?.value}
          </div>
        ))}
      </div>
    </div>
  );
};
