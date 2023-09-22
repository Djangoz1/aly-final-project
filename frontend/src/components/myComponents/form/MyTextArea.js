import React from "react";

export const MyTextArea = ({ label, placeholder }) => {
  return (
    <div className=" flex flex-col">
      <label className="text-light font-light text-xs mb-1 uppercase ">
        {label}
      </label>
      <textarea
        className="textarea font2 font-light textarea-bordered max-h-[30vh]"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};
