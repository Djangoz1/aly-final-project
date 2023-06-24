import React, { useState } from "react";

export const InputNumber = ({ increment, decrement, value }) => {
  return (
    <>
      <button className="btn join-item rounded-r-full" onClick={decrement}>
        -
      </button>
      <div className="input input-bordered flex items-center join-item">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": value }}></span>
        </span>
      </div>
      <button className="btn join-item " onClick={increment}>
        +
      </button>
    </>
  );
};

export const InputText = ({ value, setter, title }) => {
  return (
    <div className="join">
      <input
        className="input input-bordered join-item"
        placeholder={title}
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
      <button className="btn join-item ">+</button>
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
        className="textarea   textarea-bordered  textarea-lg w-full max-w-xs"
        onChange={(e) => handleChange(e)}
      ></textarea>
      <button
        className="btn btn-sm btn-primary absolute top-1 r-0 -translate-x-full z-10 "
        onClick={() => setter(isValue)}
      >
        +
      </button>
    </div>
  );
};

export const InputCheckbox = ({ value, setter }) => {
  return (
    <label className="swap w-fit">
      <input
        type="checkbox"
        onChange={() => (value ? setter(true) : setter(false))}
      />
      <div
        className="swap-on btn btn-sm btn-circle btn-success"
        onClick={() => setter(false)}
      >
        ON
      </div>
      <div
        className="swap-off btn btn-sm btn-circle btn-error"
        onClick={() => setter(true)}
      >
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
