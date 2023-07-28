import React, { useState } from "react";

export const InputNumber = ({ setter, value, target, title, style }) => {
  const handleChange = (e) => {
    if (e.target.value < 0) {
      return;
    }
    if (!target) {
      setter(e.target.value);
    } else {
      setter(target, e.target.value);
    }
  };
  return (
    <>
      <input
        className={`input input-bordered input-primary flex items-center bg-black/10 input-${
          style || "sm"
        }`}
        onChange={handleChange}
        type="number"
        value={value > 0 ? value : 0}
        placeholder={title}
      />
    </>
  );
};

export const InputText = ({ value, setter, title, target, style }) => {
  const handleChange = (e) => {
    if (!target) {
      setter(e.target.value);
    } else {
      setter(target, e.target.value);
    }
  };
  return (
    <input
      className={`input input-primary bg-black/10 w-full input-bordered join-item input-${
        style || "xs"
      }`}
      placeholder={title}
      value={value}
      onChange={(e) => handleChange(e)}
    />
  );
};

export const InputTextArea = ({ value, setter, title, style, target }) => {
  const handleChange = (e) => {
    if (!target) {
      setter(e.target.value);
    } else {
      setter(target, e.target.value);
    }
  };
  return (
    <textarea
      placeholder={title}
      value={value}
      className={`textarea w-full h-full textarea-${
        style || "sm textarea-primary bg-black/10"
      }`}
      onChange={(e) => handleChange(e)}
    ></textarea>
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
