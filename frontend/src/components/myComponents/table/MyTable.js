import React from "react";
import { v4 as uuidv4 } from "uuid";
import { MyTableEl } from "./MyTableEl";
import { _table_features } from "utils/ux-tools/table/feature";
export const MyTable = ({ head, list, editBtns }) => {
  return (
    <div className="overflow-x-auto overflow-y-visible w-full font2">
      <table className="table ">
        {/* head */}
        <thead className="bg-black/10 text-[10px]">
          <tr>
            <th></th>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            {head?.map((el) => (
              <th key={uuidv4()}>{el}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list?.map((el) => (
            <MyTableEl
              editBtns={editBtns}
              key={uuidv4()}
              id={el?.id}
              arr={el?.arr}
            />
          ))}
        </tbody>
        {/* foot */}
      </table>
    </div>
  );
};
