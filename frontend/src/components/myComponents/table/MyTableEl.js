import { Icon } from "@iconify/react";
import { icfy } from "icones";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MyModal } from "components/myComponents/modal/MyModal";
export const MyTableEl = ({ id, arr, editBtns }) => {
  return (
    <>
      <tr className="relative hover:bg-black/20 z-0  hover:text-white text-xs">
        <th className="text-[9px]"># {id}</th>
        <td>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </td>
        {arr?.map((el) => (
          <td key={uuidv4()}>{el}</td>
        ))}

        <th className="border  border-white/10   relative border-l-1 border-r-0 border-y-0">
          <div className="flex  justify-between items-center relative w-full h-full">
            <button className="btn btn-ghost btn-xs">details</button>

            <MyModal
              btn={<Icon icon={icfy.ux.dots.horizontal} className=" text-xl" />}
              styles={{ btn: "btn-ghost" }}
              modal={
                <div className="flex flex-col">
                  {editBtns?.map((el) => (
                    <btn
                      className="btn w-full flex justify-start text-left btn-ghost"
                      key={uuidv4()}
                    >
                      <Icon icon={el?.icon} />
                      {el?.title}
                    </btn>
                  ))}
                </div>
              }
            />
          </div>
        </th>
      </tr>
    </>
  );
};
