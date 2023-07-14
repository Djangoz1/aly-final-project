import React, { useState } from "react";
import { InputCheckbox } from "..";

export const InputInviteOnly = ({ datas, setDatas }) => {
  const handleChange = (_bool) => {
    const _datas = { ...datas };
    _datas.isInviteOnly = _bool;
    setDatas(_datas);
  };
  return (
    <div className="flex join p-0 items-center">
      <label className="label text-[10px]">Locked feature:</label>

      <InputCheckbox value={datas.isInviteOnly} setter={handleChange} />
    </div>
  );
};
