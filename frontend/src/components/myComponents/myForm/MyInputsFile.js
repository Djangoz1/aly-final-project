import React from "react";
import { v4 as uuidv4 } from "uuid";
export const MyInputsFile = ({ inputs, styles }) => {
  return (
    <div className={`flex w-fit ${styles}`}>
      {inputs?.map((el) => (
        <div key={uuidv4()} className="flex hover:text-white flex-col mr-5">
          <label className="text-light font-light text-xs mb-1 uppercase ">
            {el?.label}
          </label>
          <input
            type="file"
            className="file-input font-light file-input-xs file-input-bordered w-fit"
          />
        </div>
      ))}
    </div>
  );
};
