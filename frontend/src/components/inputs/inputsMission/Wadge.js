import React, { useState, useEffect } from "react";

import { useAccount, useBalance } from "wagmi";

export const InputWadge = ({ datas, setDatas }) => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  const handleChange = (value) => {
    const _datas = { ...datas };
    _datas.wadge = value;
    if (value >= 0) {
      const newBalance = data.formatted - value;
      if (newBalance >= 0) {
        setBalance(newBalance);
        setDatas(_datas);
      }
    } else {
      setBalance(datas.formatted);
      _datas.wadge = datas.wadge;
      setDatas(_datas);
    }
  };

  const handleChangeDay = (value) => {
    const _datas = { ...datas };
    _datas.estimatedDays = value;
    setDatas(_datas);
  };

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (address) {
      setBalance(data.formatted);
    }
  }, [address]);
  // (()=>{

  // },[])
  return (
    <div className="text-white flex flex-col ">
      <p className="text-white/50  font-mono flex items-center  text-xs ">
        Your balance :
        <span className="text-white ml-3 ">
          {Math.floor(balance)}
          ETH
        </span>
      </p>
      <p className="text-[10px] text-success w-full mt-1 mb-3">
        Payable amount will be sent only when the mission is finished
      </p>
      <div className="flex flex-col  text-white justify-between w-full ">
        <div className="join w-1/2 mb-1">
          <label className="label btn  btn-sm items-center flex text-sm py-0 join-item">
            ETH :
          </label>
          <input
            className="input input-sm w-full input-primary input-bordered flex items-center join-item"
            onChange={(e) => handleChange(e.target.value)}
            type="number"
            value={datas.wadge || 0}
            placeholder="Please insert a value"
          />
        </div>
        <div className="join w-1/2 mb-1">
          <label className="label btn  btn-sm items-center flex text-sm py-0 join-item">
            Day :
          </label>
          <input
            className="input input-sm w-full input-primary input-bordered flex items-center join-item"
            onChange={(e) => handleChangeDay(e.target.value)}
            type="number"
            value={datas.estimatedDays || 0}
            placeholder="Please insert a days"
          />
        </div>
      </div>
    </div>
  );
};
