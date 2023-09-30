import React, { useState } from "react";
import { InputText, InputTextArea } from "../..";
import { Icon } from "@iconify/react";
import { ListDevDomains, ListDevLanguages } from "./list";
import { InputAssignedWorker } from "../AssignedWorker";
import { _createFeature, _setFeature } from "utils/ui-tools/mission-tools";

import { useAuthState } from "context/auth";
import { _setterMISSION } from "utils/ui-tools/web3-tools";
import { AlertInfo } from "components/alert/AlertInfo";
import { MyCard } from "components/myComponents/card/MyCard";

export const InputDescription = ({ getter, datas, setDatas }) => {
  const { missionId, missions } = useAuthState();
  const [loading, setLoading] = useState(false);

  // *:::::::::::: ---------------- ::::::::::::* //
  // *:::::::::::: STATE MANAGEMENT ::::::::::::* //
  // *:::::::::::: ---------------- ::::::::::::* //

  // Change metadata
  const handleChange = (_desc) => {
    const _datas = { ...datas };
    _datas.metadata.description = _desc;
    setDatas(_datas);
  };
  // Change language
  const handleClick = (dev) => {
    const _datas = { ...datas };
    _datas.metadata.devLanguage = dev;
    setDatas(_datas);
  };
  // Change domain
  const handleClickDomain = (domain) => {
    const _datas = { ...datas };
    _datas.metadata.domain = domain;
    setDatas(_datas);
  };

  // Change title
  const handleChangeTitle = (title) => {
    const _datas = { ...datas };
    _datas.metadata.title = title;
    setDatas(_datas);
  };

  // Change url
  const handleChangeURL = (url) => {
    const _datas = { ...datas };
    _datas.metadata.url = url;
    setDatas(_datas);
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const _datas = { ...datas };
    _datas.metadata.image = file;
    setDatas(_datas);
  };

  // *:::::::::::: ----------- ::::::::::::* //
  // *:::::::::::: TRANSACTION ::::::::::::* //
  // *:::::::::::: ----------- ::::::::::::* //

  const handleSubmit = async (_datas) => {
    setLoading(true);
    await _createFeature(missionId, datas);
    getter();
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className=" flex justify-between ">
          <ListDevLanguages
            setter={handleClick}
            value={datas.metadata.devLanguage}
          />
          <InputAssignedWorker datas={datas} setDatas={setDatas} />
        </div>
        <div className="flex mt-4 ">
          <ListDevDomains
            setter={handleClickDomain}
            value={datas.metadata.domain}
          />
          <MyCard styles=" w-full flex flex-col h-full  ml-4">
            <p className=" uppercase flex text-white items-center mb-3">
              <Icon icon={"icon-park-outline:text"} className="mr-4" /> metadata
            </p>

            <div className="flex items-center my-4">
              <InputText
                title={"Title"}
                value={datas.metadata.title}
                setter={handleChangeTitle}
              />
              <div className="mx-3" />
              <InputText
                title={"URL"}
                value={datas.metadata.url}
                setter={handleChangeURL}
              />
            </div>

            <div className="my-2 ">
              <InputTextArea setter={handleChange} title="Description" />
            </div>
            <input
              type="file"
              className="file-input mt-auto file-input-bordered file-input-primary file-input-xs w-full max-w-xs"
              onChange={handleFileInputChange}
            />
          </MyCard>
        </div>
        <button
          className="btn btn-xs btn-info w-fit   mt-5 ml-auto btn-outline"
          onClick={() => handleSubmit(datas)}
        >
          Ajouter Feature
        </button>

        {loading && (
          <AlertInfo
            message={
              <>
                <span className="loading loading-ring loading-lg mr-3 "></span>
                Creation feature loading ...
              </>
            }
          />
        )}
      </div>
    </>
  );
};
