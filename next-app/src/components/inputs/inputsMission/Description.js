import React, { useEffect, useState } from "react";
import { InputTextArea } from "..";

export const InputDescription = ({ features, setFeatures }) => {
  const handleChange = (_description) => {
    const _features = { ...features };
    _features.description = _description;
    setFeatures(_features);
  };

  return (
    <>
      <label className="label ">Description :</label>
      <InputTextArea setter={handleChange} title="Description" />
    </>
  );
};
