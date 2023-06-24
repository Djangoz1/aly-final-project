import React, { useState } from "react";
import { InputNumber } from "..";

export const InputWadge = ({ features, setFeatures }) => {
  const increment = () => {
    const _features = { ...features };
    _features.wadge = features.wadge + 5;
    setFeatures(_features);
  };

  const decrement = () => {
    const _features = { ...features };
    _features.wadge = features.wadge - 5;
    setFeatures(_features);
  };

  return (
    <div>
      <label className="label ">Wadge amount for this feature :</label>
      <div className="join">
        <InputNumber
          increment={increment}
          decrement={decrement}
          value={features.wadge}
        />
      </div>
    </div>
  );
};
