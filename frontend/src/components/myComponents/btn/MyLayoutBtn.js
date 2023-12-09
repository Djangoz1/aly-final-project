import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";
import Link from "next/link";
import React, { useState } from "react";
import { v4 } from "uuid";
import { MyModal } from "../modal/MyModal";
import { Icon } from "@iconify/react";
import { icfy } from "icones";

export const MyLayoutBtn = ({ modals, btns }) => {
  let { cv, datas } = useAuthState();

  let { state } = useToolsState();
  let [isOpen, setIsOpen] = useState(null);

  return (
    <MyModal
      id={"toolsLayout"}
      style={"bg-neutral-900 w-fit c3 rounded flex"}
      btn={
        <button className=" flex  items-center justify-center  btn-circle btn-info">
          <Icon icon={icfy.ux.edit} />
        </button>
      }
    >
      <div className="flex">
        {isOpen >= 0 && (!btns?.[isOpen]?.url || !btns?.[isOpen]?.setter) ? (
          <div className="bg-white/10  border-white/5">{modals?.[isOpen]}</div>
        ) : (
          <></>
        )}
        <div className="flex w-[270px] flex-col">
          {btns?.map(
            (el, i) =>
              el?.title && (
                <Link
                  href={el?.url || "#"}
                  key={v4()}
                  onClick={() =>
                    el?.setter
                      ? el?.setter()
                      : setIsOpen(isOpen === i ? null : i)
                  }
                  className={`flex  ${
                    isOpen === i
                      ? "bg3 c1"
                      : "hover:bg-white/5 hover:text-white c4"
                  }  p-5 text-left   justify-between`}
                >
                  <Icon icon={el?.icon} className="text-[34px] w-[34px] mr-3" />
                  <div className="flex flex-col w-[200px]">
                    <h6 className="font-semibold mb-2 text-sm">{el?.title}</h6>
                    <p className="font-light text-xs">{el?.text}</p>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>
    </MyModal>
  );
};
