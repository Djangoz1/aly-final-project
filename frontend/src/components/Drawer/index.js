"use client";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ModalSetCV } from "components/modal/ModalSetCV";
import {
  // doAuthCV,
  // doAuthSigner,
  // useAuthDispatch,
  useAuthState,
} from "context/auth";
import { IcHamburger } from "icones";
import React, { useEffect, useState } from "react";
// import { _createContractCv, _getName } from "utils/ui-tools/auth-tools";
import { useAccount } from "wagmi";

export const Drawer = () => {
  const { cv } = useAuthState();
  // const dispatch = useAuthDispatch();
  const { address, isConnected } = useAccount();

  // const connect = async () => {
  //   await doAuthSigner(dispatch);
  // };

  // const createCV = async () => {
  //   const tx = await _createContractCv(address).then((res) =>
  //     doAuthCV(dispatch, factoryCv, address)
  //   );
  //   console.log(tx);
  // };

  return (
    <div className="drawer  w-fit">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {isConnected && (
          <label htmlFor="my-drawer" className="btn bg-zinc-900 drawer-button">
            <IcHamburger />
          </label>
        )}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
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
                  "dsqdsq"
                  // <button className="btn" onClick={createCV}>
                  //   Create a CV
                  // </button>
                )}
              </div>
              {cv && <ModalSetCV />}
              <div className="stat-desc text-[7px]">{address}</div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
