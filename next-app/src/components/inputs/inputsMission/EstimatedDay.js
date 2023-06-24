import React, { useState } from "react";
import { InputNumber } from "..";

export const InputEstimatedDay = ({ features, setFeatures }) => {
  const increment = () => {
    const _features = { ...features };
    _features.estimatedDay = features.estimatedDay + 1;
    setFeatures(_features);
  };
  const decrement = () => {
    const _features = { ...features };
    _features.estimatedDay = features.estimatedDay - 1;
    setFeatures(_features);
  };

  return (
    <div>
      <label className="label ">Estimated Days to complete :</label>
      <div className="join">
        <InputNumber
          increment={increment}
          decrement={decrement}
          value={features.estimatedDay}
        />
      </div>
    </div>
  );
};
