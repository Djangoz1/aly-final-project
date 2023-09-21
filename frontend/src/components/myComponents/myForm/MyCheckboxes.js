import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MyCheckboxes = ({ label, checkboxes }) => {
  return (
    <div className="flex flex-col">
      <label className="text-light font-light text-xs mb-1 uppercase ">
        {label}
      </label>
      <div className=" flex">
        {checkboxes?.map((el) => (
          <div
            key={uuidv4()}
            className="flex hover:text-white items-center text-xs mr-4"
          >
            <input className="checkbox checkbox-xs mr-1" />
            {el?.title}
          </div>
        ))}
      </div>
    </div>
  );
};
