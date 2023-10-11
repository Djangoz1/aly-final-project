import { v4 as uuidv4, v4 } from "uuid";
import { Logo } from "components/Logo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuthState } from "context/auth";
import { BtnAuth } from "components/btn/BtnAuth";
import { Icon } from "@iconify/react";
import {
  icfy,
  icfyARROWD,
  icfyCV,
  icfyHAMBURGER,
  icfyHOME,
  icfyINFO,
  icfyMAIL,
  icfyMISSION,
  icfyROCKET,
  icfySEARCH,
  icfySETTINGS,
} from "icones";
import { MyOverlay } from "components/myComponents/MyOverlay";
import { useAnimation, useViewportScroll, motion } from "framer-motion";
import { MyProgress } from "components/myComponents/layout/MyProgress";

export const Header = ({ setter, isOpen }) => {
  const { cv } = useAuthState();
  let { isConnected } = useAccount();

  const controls = useAnimation();
  const { scrollYProgress } = useViewportScroll();

  const updateScaleX = () => {
    controls.start({
      scaleX: scrollYProgress.current,
      transition: {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      },
    });
  };

  scrollYProgress.onChange(() => {
    updateScaleX();
  });

  const links = [
    { path: "/", icon: icfyHOME, title: "Home" },
    {
      path: "/community",
      icon: icfyMAIL,
      title: "Community",
      subs: [
        { path: "/community/launchpad", icon: icfyROCKET, title: "Launchpad" },
        {
          path: "/community/escrow",
          icon: icfy.court.injustice,
          title: "Escrow",
        },
        { path: "/community/escrow", icon: icfy.msg.chat, title: "Social" },
      ],
    },
    {
      path: `/profile/${cv}`,
      icon: icfyCV,
      title: "Profile",
      subs: [
        {
          path: `/profile/${cv}#section0`,
          icon: icfy.person.friend,
          title: "Social",
        },
        {
          path: `/profile/${cv}#section1`,
          icon: icfy.ux.calendar,
          title: "Agendas",
        },
      ],
    },

    { path: `/search`, icon: icfySEARCH, title: "Search" },
    { path: `/profile/${cv}#section4`, icon: icfySETTINGS, title: "Settings" },
    { path: `/about`, icon: icfyINFO, title: "About" },
  ];

  let [isClicked, setIsClicked] = useState(null);
  let [subOpen, setSubOpen] = useState(null);

  return (
    // <div className="flex fixed z-100 top-0  left-1/2 -translate-x-1/2 items-center mb-5 w-full mx-auto justify-between px-5   pt-3  h-[8vh]">
    //   <div className="w-[90%] flex relative justify-between items-center mx-auto">
    //     {/* <Logo /> */}
    //   </div>

    // </div>
    <>
      <div className="flex flex-col py-5 items-center backdrop-blur   fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] ">
        <div className="relative flex w-full  justify-between">
          <Logo />

          <button
            onClick={() => setIsClicked(!isClicked)}
            className="btn flex btn-ghost flex-col items-center transition-all  btn-sm "
          >
            {!isClicked && (
              <div className="w-8 py-[1px] rounded-full mb-1 bg-white"></div>
            )}
            <div className="w-8 py-[1px] rounded-full  bg-white"></div>
          </button>
        </div>

        <MyProgress style="progress g1 gr2 absolute bottom-0 " />
      </div>
      {isClicked && (
        <>
          <MyOverlay setter={setIsClicked} />
          <div className="right-10 fixed z-1000 font2 top-20 w-[25vw] rounded-3xl   flex flex-col items-start   ">
            <div className="backdrop-blur bg-white/30 absolute top-0 left-0 w-full h-full rounded-3xl -z-1"></div>

            <div className="px-10 py-5 w-full  ">
              {isConnected && (
                <div className=" whiteglass-text overflow-hidden items-center rounded-full bg-white c1 input-group my-2">
                  <Icon icon={icfySEARCH} className="mr-2  font-bold ml-2 " />
                  <input
                    type="text"
                    className="input py-2 input-xs h-full w-full input-ghost ml-2"
                    placeholder="Search ..."
                  />
                </div>
              )}
              {links?.map((el) => (
                <div
                  className="flex text-xl font-bold  whiteglass-text z-1000  flex-col w-full   "
                  key={v4()}
                >
                  {!el?.subs && (
                    <Link
                      className=" c1 opacity-50  hover:opacity-100 flex py-2 items-center"
                      href={el?.path}
                    >
                      <Icon icon={el?.icon} className="mr-3" />
                      {el?.title}
                    </Link>
                  )}
                  {el?.subs && (
                    <button
                      onClick={() =>
                        setSubOpen(subOpen === el?.title ? null : el?.title)
                      }
                      className=" c1  opacity-50  hover:opacity-100  py-2 transition-all flex items-center"
                    >
                      {/* <Icon icon={el?.icon} className="mr-3" /> */}
                      {el?.title}
                      <Icon
                        icon={icfyARROWD}
                        className={`ml-3 transition-all ${
                          subOpen === el?.title ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}
                  {subOpen === el?.title &&
                    el?.subs?.map((sub) => (
                      <Link
                        href={sub?.path}
                        key={v4()}
                        className="ml-5 c1 flex  opacity-50  hover:opacity-100  hover:underline items-center"
                      >
                        <Icon icon={sub?.icon} className="mr-3" />
                        {sub?.title}
                      </Link>
                    ))}
                </div>
              ))}

              <BtnAuth />
            </div>
          </div>
        </>
      )}
      {/* <Drawer setter={setter} isOpen={isOpen} /> */}
    </>
  );
};
