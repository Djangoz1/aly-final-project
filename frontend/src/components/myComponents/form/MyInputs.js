import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MyInputs = ({ inputs, styles }) => {
  return (
    <div className={`flex w-fit text-left ${styles}`}>
      {inputs?.map((el) => (
        <div className="flex hover:text-white flex-col mr-5" key={uuidv4()}>
          <label className="font-light text-xs mb-1 uppercase ">
            {el?.label}
          </label>
          <input
            className="input input-xs font-light  mr-1 "
            placeholder={el?.placeholder}
          />
        </div>
      ))}
    </div>
  );
};
