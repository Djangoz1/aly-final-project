import { Icon } from "@iconify/react";
import { icfy } from "icones";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MyModal } from "components/myComponents/modal/MyModal";
export const MyTableEl = ({ id, arr, index, editBtns, btns }) => {
  console.log(index, index % 2);
  return (
    <>
      <tr
        className={`relative   z-0  hover:text-white text-xs ${
          index % 2 === 0
            ? "bg-black/20 hover:bg-white/10"
            : "bg-black/40 hover:bg-black/80"
        }`}
      >
        <th className="text-[9px]"># {id}</th>
        <td className="">
          <label>
            <input type="checkbox" className="checkbox checkbox-xs" />
          </label>
        </td>
        {arr?.map((el) => (
          <td key={uuidv4()}>{el}</td>
        ))}

        <th className="border  border-white/10   relative border-l-1 border-r-0 border-y-0">
          <div className="flex  justify-between items-center relative w-full h-full">
            {!btns ? (
              <>
                <button className="btn btn-ghost btn-xs text-[9px]">
                  details
                </button>

                <MyModal
                  btn={
                    <Icon icon={icfy.ux.dots.horizontal} className=" text-xl" />
                  }
                  styles={{ btn: "btn-ghost" }}
                  modal={
                    <div className="flex flex-col">
                      {editBtns?.map((el) => (
                        <button
                          className="btn w-full flex justify-start text-left btn-ghost"
                          key={uuidv4()}
                          onClick={() => el?.setter && el?.setter(id)}
                        >
                          <Icon icon={el?.icon} />
                          {el?.title}
                        </button>
                      ))}
                    </div>
                  }
                />
              </>
            ) : (
              btns
            )}
          </div>
        </th>
      </tr>
    </>
  );
};
