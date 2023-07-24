import React, { useEffect, useState } from "react";
import { InputNumber, InputText } from "..";
import { IntTierDatas } from "constants/interfaces";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "@iconify/react";
import { icfyETH } from "icones";
import { calcTierAverage } from "utils/ui-tools/launchpad-tools";
export const LaunchpadRound = ({ datas, setter }) => {
  const [isIndex, setIsIndex] = useState(0);

  const handleChangeDatas = (_tierDatas, index) => {
    setter({
      ...datas,
      tiers: [...datas.tiers, (datas.tiers[index] = _tierDatas)],
    });
  };

  const remove = () => {
    const _tiers = datas.tiers.filter((el, index) =>
      index !== isIndex ? el : null
    );
    setter({ ...datas, tiers: _tiers });
    setIsIndex(isIndex - 1 >= 0 ? isIndex - 1 : 0);
  };

  const handleChangeEl = (target, value) => {
    const _datas = datas;

    const _tiers = _datas.tiers.map((el, index) =>
      index === isIndex ? { ...el, [target]: value } : (el = datas.tiers[index])
    );

    setter({
      ...datas,
      tiers: _tiers,
    });
  };

  return (
    <div className="flex flex-col mb-5">
      <div className="divider">
        {datas.tiers?.map((item, index) => (
          <button
            className={`btn btn-sm btn-primary ${
              index !== isIndex && "btn-outline"
            }`}
            onClick={() => setIsIndex(index)}
            key={uuidv4()}
          >
            <span className="countdown font-mono ">
              <span style={{ "--value": index + 1 }}></span>
            </span>
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col items-center">
        <label className="text-primary text-center">Nombre de round</label>
        <div className="join w-1/6  my-2">
          <button
            className="join-item w-1/2 btn btn-xs btn-success text-white"
            onClick={() => handleChangeDatas(IntTierDatas, datas.tiers.length)}
          >
            Add
          </button>
          <button
            className="join-item w-1/2 btn text-white btn-xs btn-error"
            onClick={remove}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex ">
        <div className="flex  flex-col justify-evenly w-1/3  mb-5">
          <div className="flex  flex-col">
            <label className="text-primary">Min. Cap.</label>

            <InputNumber
              value={datas.tiers?.[isIndex]?.minTierCap}
              setter={handleChangeEl}
              target={"minTierCap"}
              style={"xs"}
            />
          </div>
          <div className="flex  flex-col my-2">
            <label className="text-primary">Max. Cap.</label>

            <InputNumber
              value={datas.tiers?.[isIndex]?.maxTierCap}
              style={"xs"}
              setter={handleChangeEl}
              target={"maxTierCap"}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary">Token Price</label>

            <InputNumber
              style={"xs"}
              setter={handleChangeEl}
              target={"tokenPrice"}
              value={datas.tiers?.[isIndex]?.tokenPrice}
            />
          </div>
        </div>

        <div className="flex w-fit ml-auto mr-[10vw] flex-col">
          <div className="flex items-center">
            <p className="flex flex-col items-center ">
              Min
              <span
                className={`countdown font-mono ${
                  calcTierAverage(datas, "minTierCap") === 0
                    ? "text-error"
                    : "text-black"
                }`}
              >
                <span
                  style={{ "--value": calcTierAverage(datas, "minTierCap") }}
                ></span>
              </span>
            </p>
            <Icon icon={icfyETH} className={"text-success text-[160px]"} />
            <p className="flex flex-col items-center ">
              Max
              <span
                className={`countdown font-mono ${
                  calcTierAverage(datas, "maxTierCap") === 0
                    ? "text-error"
                    : "text-black"
                }`}
              >
                <span
                  style={{ "--value": calcTierAverage(datas, "maxTierCap") }}
                ></span>
              </span>
            </p>
          </div>
          <p className="flex flex-col items-center w-full">
            Price
            <span
              className={`countdown font-mono ${
                calcTierAverage(datas, "tokenPrice") === 0
                  ? "text-error"
                  : "text-black"
              }`}
            >
              <span
                style={{ "--value": calcTierAverage(datas, "tokenPrice") }}
              ></span>
            </span>
          </p>
          <div className="flex justify-between flex-wrap"></div>
        </div>
      </div>
    </div>
  );
};
