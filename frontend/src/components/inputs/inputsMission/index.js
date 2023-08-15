import { InputText, InputTextArea } from "components/inputs";

import { v4 as uuidv4 } from "uuid";

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
import { corporateStats, missionType, prototypeStats } from "constants/stats";
import { Icon } from "@iconify/react";
import { icfyINFO } from "icones";

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

  const inputs = [missionType, prototypeStats, corporateStats];

  return (
    <div className="flex  justify-between">
      <div className="flex flex-col mx-auto w-[800px]">
        {inputs?.map((stats) => (
          <div className="flex flex-col mb-4 w-full" key={uuidv4()}>
            <h5 className="font-bold text-white">{stats.title}</h5>
            <div className="flex flex-wrap justify-between w-full">
              {stats.values?.map((el) => (
                <div
                  className="border flex items-center text-white w-[49%] text-xs p-3 rounded border-slate-800/60 hover:border-white mb-3"
                  key={uuidv4()}
                >
                  {el} <Icon icon={icfyINFO} className="text-info ml-3" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col">
          <h5 className="font-bold text-white">Do you have actual website ?</h5>
          <div className="flex">
            <InputText
              title={"https://link-of-your-website.com"}
              value={datas.url}
              setter={onChange}
              target={"url"}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h5 className="font-bold text-white">Description of your project</h5>
          <div className="flex mb-3">
            <InputText
              value={datas.title}
              title={"Name of your project"}
              target={"title"}
              setter={onChange}
            />
          </div>
          <InputTextArea
            title={"Description of your project"}
            value={datas.description}
            target={"description"}
            setter={onChange}
          />
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
