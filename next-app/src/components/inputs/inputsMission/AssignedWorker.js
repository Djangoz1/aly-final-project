import React, { useState } from "react";
import { InputText } from "..";

export const InputAssignedWorker = ({ features, setFeatures }) => {
  const handleChange = (_assignedWorker) => {
    const _features = { ...features };
    _features.assignedWorker = _assignedWorker;
    setFeatures(_features);
  };
  return (
    <>
      <label className="label ">Assigned Worker :</label>
      <InputText
        value={features.assignedWorker}
        setter={handleChange}
        title="Assigned Worker"
      />
    </>
  );
};
