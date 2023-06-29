import React, { useState } from "react";

export const InputWadge = ({ features, setFeatures }) => {
  const handleChange = (value) => {
    const _features = { ...features };
    _features.wadge = value;
    if (value >= 0) {
      const newBalance = initBalance - value;
      if (newBalance >= 0) {
        setBalance(newBalance);
        setFeatures(_features);
      }
    } else {
      setBalance(initBalance);
      _features.wadge = features.wadge;
      setFeatures(_features);
    }
  };

  const handleChangeDay = (value) => {
    const _features = { ...features };
    _features.estimatedDay = value;
    setFeatures(_features);
  };

  // ! TO DELETE : REMPLACER PAR LA BALANCE UNE FOIS QUE TOUTE LA PARTIE MONNAIE EST RÉGLER
  const initBalance = 90;
  const [balance, setBalance] = useState(initBalance);
  return (
    <div className="bg-base-100 flex flex-col ">
      <span className="countdown font-mono text-xs ">
        Your balance :{" "}
        <span
          className="ml-1 mr-2 text-white"
          style={{ "--value": balance }}
        ></span>
        ETH
      </span>
      <p className="text-[10px] text-success w-full mt-1 mb-3">
        Payable amount will be sent only when the mission is finished
      </p>
      <div className="flex flex-col justify-between w-full ">
        <div className="join w-1/2 mb-1">
          <label className="label btn  btn-xs items-center flex text-xs py-0 join-item">
            ETH :
          </label>
          <input
            className="input input-xs w-full input-primary input-bordered flex items-center join-item"
            onChange={(e) => handleChange(e.target.value)}
            type="number"
            value={features.wadge || 0}
            placeholder="Please insert a value"
          />
        </div>
        <div className="join w-1/2 mb-1">
          <label className="label btn  btn-xs items-center flex text-xs py-0 join-item">
            Day :
          </label>
          <input
            className="input input-xs w-full input-primary input-bordered flex items-center join-item"
            onChange={(e) => handleChangeDay(e.target.value)}
            type="number"
            value={features.estimatedDay || 0}
            placeholder="Please insert a days"
          />
        </div>
      </div>
    </div>
  );
};
