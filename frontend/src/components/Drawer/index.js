"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ModalSetCV } from "components/modal/ModalSetCV";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { IcHamburger } from "icones";

import { _createContractCv, _getName } from "utils/ui-tools/auth-tools";
import { _setterCV, _setterFactoryCV } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";

export const Drawer = ({ setter, isOpen }) => {
  const { cv } = useAuthState();

  const { address, isConnected } = useAccount();
  const dispatch = useAuthDispatch();
  const createCV = async () => {
    await _setterFactoryCV("createCV", [address]);
    doAuthCV(dispatch, address);
  };

  return (
    <div className="  w-fit">
      {/* <input id="my-drawer" type="checkbox" className="drawer-toggle" /> */}
      <div className=" ">
        {isConnected ? (
          <label
            // htmlFor="my-drawer"
            onClick={setter}
            className="btn bg-zinc-900 "
          >
            <IcHamburger />
          </label>
        ) : (
          <ConnectButton />
        )}
      </div>
      {isOpen && (
        <div className="w-[18vw] h-screen top-0 left-0  fixed">
          <ul className="menu  p-4 w-full relative  h-full bg-base-200 text-base-content">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">User :</div>
                <div className="stat-value">
                  {cv ? (
                    <CVName />
                  ) : (
                    <button className="btn" onClick={createCV}>
                      Create a CV
                    </button>
                  )}
                </div>
                {cv && <ModalSetCV />}
                <ConnectButton />
                <div className="stat-desc text-[7px]">{address}</div>
              </div>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};
