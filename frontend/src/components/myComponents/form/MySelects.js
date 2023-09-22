import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MySelects = ({ selects, styles }) => {
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {selects?.map((el) => (
        <div key={uuidv4()} className="flex hover:text-white flex-col mr-10">
          <label className="text-light font-light text-xs mb-1 uppercase ">
            {el?.label}
          </label>
          <select className="select font-light select-xs select-bordered w-full max-w-xs">
            <option disabled selected>
              {el?.placeholder}
            </option>
            {el?.arr?.map((op) => (
              <option key={uuidv4()}>{op?.[el?.target] || op}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
