import React, { useState } from "react";
import { InputCheckbox } from "..";

export const InputInviteOnly = ({ features, setFeatures }) => {
  const handleChange = (_bool) => {
    const _features = { ...features };
    _features.inviteOnly = _bool;
    setFeatures(_features);
  };
  return (
    <div className="flex join p-0 items-center">
      <label className="label text-[10px]">Locked feature:</label>

      <InputCheckbox value={features.inviteOnly} setter={handleChange} />
    </div>
  );
};
