"use client";
import { ModalSetCV } from "components/modal/ModalSetCV";
import {
  doAuthCV,
  doAuthSigner,
  useAuthDispatch,
  useAuthState,
} from "context/auth";
import { IcHamburger } from "icones";
import React, { useEffect, useState } from "react";
import { _createContractCv, _getName } from "utils/auth-tools";

export const Drawer = () => {
  const { address, cv, factoryCv } = useAuthState();
  const dispatch = useAuthDispatch();

  const [name, setName] = useState();

  const getName = async () => {
    if (cv) {
      let _name = await _getName(cv);
      setName(_name);
      return name;
    }
  };

  useEffect(() => {
    if (cv) {
      getName();
    }
  }, [cv]);

  const connect = async () => {
    await doAuthSigner(dispatch);
  };

  const createCV = async () => {
    await _createContractCv(address);
    await doAuthCV(dispatch, factoryCv, address);
  };

  return (
    <div className="drawer  w-fit">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {/* Page content here */}
        {!address ? (
          <button className="btn btn-primary" onClick={connect}>
            Connect
          </button>
        ) : (
          <label htmlFor="my-drawer" className="btn bg-zinc-900 drawer-button">
            <IcHamburger />
          </label>
        )}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
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
                {name ? (
                  name
                ) : (
                  <button className="btn" onClick={createCV}>
                    Create a CV
                  </button>
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
