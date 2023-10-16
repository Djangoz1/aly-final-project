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
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import { MyProgress } from "components/myComponents/layout/MyProgress";
import { useToolsState } from "context/tools";

export const Header = ({ setter, isOpen }) => {
  const { cv } = useAuthState();
  let [isClicked, setIsClicked] = useState(null);
  let { isConnected } = useAccount();

  const [isHovered, setIsHovered] = useState(false);

  const { pointer } = useToolsState();
  const controls = useAnimation();

  const startHideTimer = () => {
    if (controls) {
      if (pointer > 0 && !isClicked) {
        setTimeout(() => {
          controls?.start({ opacity: 0, y: -100 });
        }, 10000);
      } // Disparaître après 10 secondes
      else if (pointer === 0 && !isClicked) {
        controls?.start({ opacity: 1, y: 0 });
        setTimeout(() => {
          controls?.start({ opacity: 0, y: -100 });
        }, 50000);
      } else {
        controls?.start({ opacity: 1, y: 0 });
      }
    }
    // Disparaître après 10 secondes
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    controls?.start({ opacity: 1, y: 0 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // startHideTimer();
  };

  // Appeler startHideTimer lorsque le composant est monté
  useEffect(() => {
    startHideTimer();
  }, [pointer, isOpen, isClicked, controls]);

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

  let [subOpen, setSubOpen] = useState(null);
  const sidebarVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.45 },
    },
    closed: {
      opacity: 0,
      x: -200, // Déplace la sidebar vers la gauche
      transition: { duration: 0.3 },
    },
  };

  return (
    true && (
      // <div className="flex fixed z-100 top-0  left-1/2 -translate-x-1/2 items-center mb-5 w-full mx-auto justify-between px-5   pt-3  h-[8vh]">
      //   <div className="w-[90%] flex relative justify-between items-center mx-auto">
      //     {/* <Logo /> */}
      //   </div>

      // </div>sho

      <AnimatePresence>
        <>
          <motion.div
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
            className="flex fixed -z-1 box-border  flex-col min-h-[5vh] top-0 "
          >
            <motion.div
              whileHover={{ opacity: 1, y: 0 }}
              initial={{ opacity: 1, y: 0 }}
              animate={(!isHovered || pointer === 0) && controls}
              className="relative flex z-100 w-screen py-5 px-5   box-border items-center justify-between backdrop-blur"
            >
              <Logo />

              <button
                onClick={() => setIsClicked(!isClicked)}
                className="btn cursor-pointer z-1000  flex btn-ghost flex-col items-center transition-all  btn-sm "
              >
                {!isClicked && (
                  <div className="w-8 py-[1px] rounded-full mb-1 bg-white"></div>
                )}
                <div className="w-8 py-[1px] rounded-full  bg-white"></div>
              </button>
              <MyProgress style="progress g1 mr-5 w-[97%] gr2 absolute bottom-0 " />
            </motion.div>
            <>
              {isClicked && <MyOverlay style={" "} setter={setIsClicked} />}
              <motion.div
                initial={false}
                animate={isClicked ? "open" : "closed"}
                variants={sidebarVariants}
                className={`h-[95vh]  backdrop-blur absolute left-0    bg-white/60 font2 top-[8vh]        flex flex-col items-start   ${
                  isClicked ? "w-[25vw]" : "w-0"
                }`}
              >
                <div className="px-10 py-5 w-full  ">
                  {isConnected && (
                    <div className=" whiteglass-text overflow-hidden items-center rounded-full bg-white c1 input-group my-2">
                      <Icon
                        icon={icfySEARCH}
                        className="mr-2  font-bold ml-2 "
                      />
                      <input
                        type="text"
                        className="input py-2 input-xs h-full w-full input-ghost ml-2"
                        placeholder="Search ..."
                      />
                    </div>
                  )}
                  {links?.map((el) => (
                    <div
                      className="flex text-xl mb-5 font-bold  whiteglass-text z-1000  flex-col w-full   "
                      key={v4()}
                    >
                      {!el?.subs && (
                        <Link
                          className=" c1 hover:text-black hover:opacity-100 flex py-2 items-center"
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
                          className=" c1  opacity-80  hover:opacity-100  py-2 transition-all flex items-center"
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
                            className="ml-5 c1 hover:text-black flex   items-center"
                          >
                            <Icon icon={sub?.icon} className="mr-3" />
                            {sub?.title}
                          </Link>
                        ))}
                    </div>
                  ))}

                  <BtnAuth />
                </div>
              </motion.div>
            </>
          </motion.div>
        </>

        {/* <Drawer setter={setter} isOpen={isOpen} /> */}
      </AnimatePresence>
    )
  );
};
