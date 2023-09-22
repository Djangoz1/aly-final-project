import { Icon } from "@iconify/react";
import { icfy } from "icones";
import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MyTableEl = ({ id, arr }) => {
  return (
    <tr className="relative hover:bg-black/20 hover:text-white text-xs">
      <th className="text-[9px]"># {id}</th>
      <td>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </td>
      {arr?.map((el) => (
        <td key={uuidv4()}>{el}</td>
      ))}

      <th className="border  border-white/10  relative border-l-1 border-r-0 border-y-0">
        <div className="flex  justify-between items-center w-full h-full">
          <button className="btn btn-ghost btn-xs">details</button>
          <button className="btn btn-ghost btn-xs w-fit">
            <Icon icon={icfy.ux.dots.horizontal} className=" text-xl" />
          </button>
        </div>
      </th>
    </tr>
  );
};
