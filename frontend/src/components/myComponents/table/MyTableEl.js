import { Icon } from "@iconify/react";
import { icfy } from "icones";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { MyModal } from "components/myComponents/modal/MyModal";
import { MyBtnPost } from "../btn/MyBtnPost";
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

        <th className="border  border-white/10 w-fit max-w-[130px]     border-l-1 border-r-0 border-y-0">
          <div className="flex  justify-between w-full items-center   h-full">
            {!btns ? (
              <>
                {/* <button className="btn btn-ghost btn-xs text-[9px]">
                  details
                </button> */}
                <div className="flex w-full   items-center">
                  {editBtns?.map((el) => (
                    <MyBtnPost
                      style={el?.style}
                      key={uuidv4()}
                      setter={() => el?.setter && el?.setter(id)}
                    >
                      {el?.icon && <Icon icon={el?.icon} />}
                      {el?.title}
                    </MyBtnPost>
                  ))}
                </div>
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
