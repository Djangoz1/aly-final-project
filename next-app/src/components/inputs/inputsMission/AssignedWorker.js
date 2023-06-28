import React, { useEffect, useState } from "react";
import { InputText } from "..";
import { _getAllCVs } from "utils/ui-tools/cv-tools";
import { _getName } from "utils/ui-tools/auth-tools";
import { ZERO_ADDRESS } from "@openzeppelin/test-helpers/src/constants";

export const InputAssignedWorker = ({ features, setFeatures }) => {
  const [listNames, setListNames] = useState([]);

  const getNames = async (_name) => {
    const cvs = await _getAllCVs();
    const arr = [];
    for (let index = 0; index < cvs.length; index++) {
      const element = cvs[index];
      const name = await _getName(element);
      if (
        name.toLowerCase().includes(_name.toLowerCase()) ||
        element.toLowerCase().includes(_name.toLowerCase())
      ) {
        arr.push({ name, address: element });
      }
    }
    setListNames(arr);
    return arr;
  };

  const handleChange = async (_assignedWorker) => {
    const _features = { ...features };
    console.log("test", _assignedWorker);
    _features.assignedWorker = _assignedWorker;
    const stateNames = await getNames(_assignedWorker);
    if (stateNames.length === 1) {
      _features.assignedWorker = stateNames[0].address;
    }
    setFeatures(_features);
  };

  const handleClick = async (_assignedWorker) => {
    const _features = { ...features };
    console.log("test", _assignedWorker);
    _features.assignedWorker = _assignedWorker;
    setFeatures(_features);
  };

  return (
    <div>
      <label className="label ">Assigned Worker :</label>
      <div className="flex flex-col w-full ">
        <InputText
          value={
            features.assignedWorker !== ZERO_ADDRESS
              ? features.assignedWorker
              : ""
          }
          setter={handleChange}
          title="Please input name or address cv"
        />
        <div className="flex flex-col  p-2 ">
          {listNames?.map((elem, index) => (
            <div
              className={`btn   flex my-1 justify-between ${
                index % 2 === 0 ? "btn-primary" : "btn-secondary btn-outline"
              }`}
              key={elem?.address}
              onClick={() => handleClick(elem?.address)}
            >
              <p>{elem?.name}</p>
              <p className="flex flex-col items-start text-[8px]">
                <span className="">CV Address : </span>

                <span className="w-[70px] truncate">{elem?.address}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
