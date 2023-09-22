"use client";
import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ModalSetCV } from "components/modal/ModalSetCV";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { v4 as uuidv4 } from "uuid";
import {
  IcHamburger,
  icfyCV,
  icfyHAMBURGER,
  icfyHOME,
  icfyINFO,
  icfyMAIL,
  icfyMISSION,
  icfyROCKET,
  icfySETTINGS,
} from "icones";

import { _createContractCv, _getName } from "utils/ui-tools/auth-tools";

import { useAccount } from "wagmi";
import Link from "next/link";

export const Drawer = ({ setter, isOpen }) => {
  const { cv } = useAuthState();

  const currentUrl = window?.location?.pathname || null;

  const { address, isConnected } = useAccount();
  const dispatch = useAuthDispatch();
  const createCV = async () => {
    // await _setterFactoryCV("createCV", [address]);
    doAuthCV(dispatch, address);
  };

  console.log(cv);
  const links = [
    { path: "/", icon: icfyHOME, title: "Home" },
    { path: "/community", icon: icfyMAIL, title: "Community" },
    { path: "/community/launchpad", icon: icfyROCKET, title: "Launchpad" },
    { path: `/profile/${cv}`, icon: icfyCV, title: "Profile" },
    { path: `/profile/mission`, icon: icfyMISSION, title: "Mission" },
    { path: `/settings`, icon: icfySETTINGS, title: "Settings" },
    { path: `/about`, icon: icfyINFO, title: "About" },
  ];

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
            <Icon icon={icfyHAMBURGER} className="text-[30px] text-white" />
          </label>
        ) : (
          <ConnectButton />
        )}
      </div>
      {/* {isOpen && ( */}
      <div
        className={`${
          isOpen ? "w-[18vw]" : "w-[6vw]"
        } h-screen top-0  left-0  fixed`}
      >
        <ul className="menu  p-2 w-full relative  h-full page text-base-content">
          {links?.map((el) => (
            <Link
              key={uuidv4()}
              href={el?.path}
              className={`btn  mx-auto shadow btn-ghost flex justify-between ${
                isOpen ? "w-full" : "w-fit"
              }`}
            >
              <Icon
                icon={el?.icon}
                className={`${
                  currentUrl === el?.path ? "text-secondary" : "text-white/60"
                } text-2xl`}
              />
              {isOpen && (
                <span
                  className={`${
                    currentUrl === el?.path ? "text-secondary" : "text-white/60"
                  } text-xs `}
                >
                  {el?.title}
                </span>
              )}
            </Link>
          ))}
          {isOpen && (
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

                <ConnectButton />
                <div className="stat-desc text-[7px]">{address}</div>
              </div>
            </div>
          )}
        </ul>
      </div>
      {/* )} */}
    </div>
  );
};
