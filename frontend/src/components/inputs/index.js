import React, { useState } from "react";

export const InputNumber = ({ setter, value }) => {
  return (
    <>
      <input
        className="input input-bordered flex items-center join-item"
        onChange={(e) => setter(e.target.value)}
        type="number"
      />
    </>
  );
};

export const InputText = ({ value, setter, title, style }) => {
  return (
    <div className={`join w-full `}>
      <input
        className={`input w-full input-bordered join-item input-${style?.input}`}
        placeholder={title}
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
      <button className={`btn join-item btn-${style?.btn}`}>+</button>
    </div>
  );
};

export const InputTextArea = ({ value, setter, title }) => {
  const handleChange = (e) => {
    setter(e.target.value);
  };
  return (
    <div className="relative">
      <textarea
        placeholder={title}
        value={value}
        className="textarea    textarea-bordered  textarea-xs w-full max-w-xs"
        onChange={(e) => handleChange(e)}
      ></textarea>
    </div>
  );
};

export const InputCheckbox = ({ value, setter }) => {
  return (
    <label className="swap  w-fit">
      <input
        type="checkbox"
        onChange={() => (value ? setter(true) : setter(false))}
      />
      <div
        className="swap-on badge   btn-success"
        onClick={() => setter(false)}
      >
        ON
      </div>
      <div className="swap-off badge  btn-error" onClick={() => setter(true)}>
        OFF
      </div>
    </label>
    // <div className="flex">
    //   <input
    //     onChange={() => setter(true)}
    //     type="radio"
    //     name="radio-8"
    //     className="radio radio-success mr-4"
    //     checked={value ? true : false}
    //   />

    //   <input
    //     type="radio"
    //     name="radio-8"
    //     className="radio radio-error"
    //     checked={value ? false : true}
    //     onChange={() => setter(false)}
    //   />
    // </div>
  );
};
