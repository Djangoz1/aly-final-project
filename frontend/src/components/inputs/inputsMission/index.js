import { InputText, InputTextArea } from "components/inputs";

import { ethers } from "ethers";
import {
  doAuthMission,
  doAuthMissionId,
  useAuthDispatch,
  useAuthState,
} from "context/auth";

import React, { useEffect, useState } from "react";
import {
  _createContractMission,
  _createMission,
} from "utils/ui-tools/mission-tools";

import {
  _getterAccessControl,
  _getterMissionsHub,
  _setterCV,
  _setterMISSION,
} from "utils/ui-tools/web3-tools";
import { AlertInfo } from "components/alert/AlertInfo";

export const CreationMission = () => {
  const { cv } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loading, setLoading] = useState(false);

  let [amount, setAmount] = useState(0);
  let [datas, setDatas] = useState({
    title: "",
    description: "",
    reference: 0,
    url: "",
    image: "",
  });

  useEffect(() => {
    (async () => {
      // Récupération du prix de la mission
      const _amount = parseInt(await _getterAccessControl("missionPrice"));
      setAmount(ethers.utils.formatEther(`${_amount}`));
    })();
  }, []);

  //  *::::::: ---------------- :::::::* //
  //  *::::::: STATE MANAGEMENT :::::::* //
  //  *::::::: ---------------- :::::::* //

  const onChange = (variable, value) => {
    setDatas({ ...datas, [variable]: value });
  };

  // Récupération de l'input file
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    onChange("image", file);
  };

  //  *::::::: ----------- :::::::* //
  //  *::::::: TRANSACTION :::::::* //
  //  *::::::: ----------- :::::::* //

  const handleCreateMission = async () => {
    setLoading(true);
    await _createMission(datas);
    doAuthMission(dispatch, cv);
    setLoading(false);
  };

  return (
    <div className="flex  justify-between">
      <div className="flex flex-col mx-auto w-[800px]">
        <div className="flex flex-col">
          <label className="label ">Title :</label>
          <div className="flex">
            <InputText
              value={datas.title}
              title={"Provide a title of your mission"}
              target={"title"}
              setter={onChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="label ">Link reference :</label>
          <div className="flex">
            <InputText
              title={
                "Provide a link to additional documentation of your mission"
              }
              value={datas.url}
              setter={onChange}
              target={"url"}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="label ">Description :</label>
          <div className="flex">
            <InputTextArea
              title={"Provide a description of your mission"}
              value={datas.description}
              target={"description"}
              setter={onChange}
            />
          </div>
        </div>
        <div className="flex justify-evenly items-center my-3">
          <div className="flex flex-col">
            <input
              type="file"
              className="file-input file-input-bordered file-input-xs file-input-primary w-full max-w-xs"
              onChange={handleFileInputChange}
            />
          </div>
          <button className="btn btn-outline btn-primary w-1/3 btn-xs">
            Add mission reference
          </button>
        </div>
        <div className="w-1/2 mx-auto flex items-center  mt-5 flex-col">
          <button
            className="btn btn-primary  w-full"
            onClick={handleCreateMission}
          >
            Create a mission
          </button>
          <p className="text-black/40">Price : {amount} eth</p>
        </div>
      </div>
      {loading && (
        <AlertInfo
          message={
            <>
              <span className="loading loading-ring loading-lg mr-3 "></span>
              Creation mission loading ...
            </>
          }
        />
      )}
    </div>
  );
};

export const ListMission = () => {
  const { missions, missionId } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleClick = (_index) => {
    doAuthMissionId(dispatch, missions, _index);
  };

  return (
    <div className="tabs w-fit  tabs-boxed">
      <a
        onClick={() => handleClick(null)}
        className={`tab tab-sm tab-success tab-lifted ${
          missionId === null && "tab-active"
        }`}
      >
        Create mission
      </a>
      {missions.map((mission, index) => (
        <a
          key={mission}
          onClick={() => handleClick(mission)}
          className={`tab tab-sm tab-lifted ${
            parseInt(mission) === missionId && "tab-active"
          }`}
        >
          Mission #{parseInt(mission)}
        </a>
      ))}
    </div>
  );
};
