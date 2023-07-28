import { Icon } from "@iconify/react";
import { AlertError, AlertInfo } from "components/alert/AlertInfo";
import { InputNumber, InputText, InputTextArea } from "components/inputs";
import { LaunchpadAllowance } from "components/inputs/inputsLaunchpad/LaunchpadAllowance";
import { LaunchpadMetadata } from "components/inputs/inputsLaunchpad/LaunchpadMetadata";
import { LaunchpadRound } from "components/inputs/inputsLaunchpad/LaunchpadRound";
import { MyModal } from "components/modal/MyModal";
import { IntTierDatas } from "constants/interfaces";
import { ethers } from "ethers";
import { icfySEND } from "icones";
import React, { useState } from "react";
import { calcTierAverage } from "utils/ui-tools/launchpad-tools";
import { createPubOnPinata } from "utils/ui-tools/pinata-tools";
import {
  _getterAccessControl,
  _getterLaunchpadHub,
  _setterAccessControl,
  _setterERC20,
} from "utils/ui-tools/web3-tools";
import { useRouter } from "next/navigation";

export const CreationLaunchpad = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datas, setDatas] = useState({
    tokenAddress: "",
    title: "",
    description: "",
    image: null,
    maxCap: 0,
    minCap: 0,
    minInvest: 0,
    maxInvest: 0,
    tiers: [IntTierDatas],
    saleStart: null,
    saleEnd: null,
    lockedTime: 0,
    allowance: 0,
  });

  const handleChangeDatas = (target, value) => {
    const _datas = { ...datas, [target]: value };

    setDatas(_datas);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const pub = await createPubOnPinata({
      title: datas.title,
      description: datas.description,
      image: datas.image,
    });

    const launchpadDatas = {
      tokenAddress: datas.tokenAddress,
      pubURI: pub,
      numberOfTier: datas.tiers.length,
      maxCap: calcTierAverage(datas, "maxTierCap"),
      minCap: calcTierAverage(datas, "minTierCap"),
      minInvest: parseInt(datas.minInvest),
      maxInvest: parseInt(datas.maxInvest),
      saleStart: parseInt(datas.saleStart),
      saleEnd: parseInt(datas.saleEnd),
      lockedTime: parseInt(datas.lockedTime),
      totalUser: 0,
    };
    const tiersDatas = datas.tiers.map(
      (el) =>
        (el = {
          maxTierCap: parseInt(el.maxTierCap),
          minTierCap: parseInt(el.minTierCap),
          amountRaised: 0,
          tokenPrice: parseInt(el.tokenPrice),
          users: 0,
        })
    );

    const price = await _getterAccessControl("launchpadPrice");
    let tx = await _setterAccessControl(
      "createLaunchpad",
      [launchpadDatas, tiersDatas],
      price
    );
    if (tx?.error?.message) {
      setError(tx?.error?.message);
    } else {
      const length = parseInt(await _getterLaunchpadHub("getTokensLength"));
      const address = await _getterLaunchpadHub("getLaunchpad", [length - 1]);
      tx = await _setterERC20(datas?.tokenAddress, "approve", [
        address,
        datas?.allowance,
      ]);
      router.push("/community/launchpad");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col w-full ">
        <div className="flex mb-5 items-center">
          <div className="flex flex-col w-1/2">
            <label className="text-primary">Token address</label>
            <InputText
              title={"Enter your token address"}
              setter={handleChangeDatas}
              target={"tokenAddress"}
            />
          </div>
          <div className="flex ml-5 flex-col">
            Don't have token ?
            <button className="btn btn-primary btn-xs">Create token</button>
          </div>
        </div>
        <LaunchpadRound datas={datas} setter={setDatas} />
        <LaunchpadAllowance datas={datas} setter={handleChangeDatas} />
        <LaunchpadMetadata datas={datas} setter={handleChangeDatas} />

        <button
          className="btn btn-primary w-fit ml-auto btn-sm mt-5"
          onClick={handleSubmit}
        >
          {!loading ? (
            <>
              Submit
              <Icon icon={icfySEND} className="text-xl" />
            </>
          ) : (
            <span className="loading loading-dots loading-md text-white" />
          )}
        </button>
      </div>
      {error && <AlertError message={error} setter={setError} />}
    </>
  );
};
