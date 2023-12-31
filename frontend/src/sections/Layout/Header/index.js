"use client";
import { v4 as uuidv4, v4 } from "uuid";
import { Logo } from "components/Logo";
import "./style.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuthState } from "context/auth";
import { BtnAuth } from "components/btn/BtnAuth";
import { Icon } from "@iconify/react";
import { icfy, icfySEARCH, icfySETTINGS, icsystem } from "icones";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MyProgress } from "components/myComponents/layout/MyProgress";
import { useToolsState } from "context/tools";

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

import { Avatar } from "components/profile/ProfileAvatar";

export const Element = ({ object }) => {
  let { url } = useToolsState();
  return (
    <Popover className="relative">
      <Popover.Button
        className={`uppercase  border-b px-3   pb-1  text-xs font-light ${
          url?.includes(object?.title)
            ? " c3   border-white/30 "
            : "c4 border-transparent hover:border-white/30 hover:text-white"
        }`}
      >
        <span>{object?.title}</span>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {object?.arr?.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <Icon
                      className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      aria-hidden="true"
                      icon={item?.icon || icfy.ux.admin}
                    />
                  </div>
                  <div>
                    <a href={item.href} className="font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
              {object?.actions?.map((item) => (
                <Link
                  key={v4()}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <Icon
                    className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                    aria-hidden="true"
                    icon={item?.icon || icfy.ux.admin}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export const Header = ({ children, style }) => {
  const { cv, metadatas } = useAuthState();
  let [isClicked, setIsClicked] = useState(null);
  let { isConnected } = useAccount();

  const { pointer, state, target, url } = useToolsState();

  let { scrollYProgress, scrollY } = useScroll();

  //** Check si isScrollY > 200 faire disparaître le header * /
  //** si isScrollY < latest faire apparaître le header * /
  //** si isScrollY > latest faire disparaître le header * /
  //** si isScrollY < 200 faire apparaître le header * /
  const [isScrollY, setIsScrollY] = useState(0);
  const [isOnView, setIsOnView] = useState(true);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 200 && latest > isScrollY && isOnView) {
      setIsOnView(false);
    } else if (latest < isScrollY && !isOnView) {
      setIsOnView(true);
    }
    setIsScrollY(latest);
  });

  return (
    <>
      {/* <motion.div
        onViewportLeave={() => setIsOnView(false)}
        onViewportEnter={() => setIsOnView(true)}
        className="h-[9vh] w-full"
      ></motion.div> */}
      <motion.header
        animate={{ y: isOnView ? 0 : -100, opacity: isOnView ? 1 : 0 }}
        initial={{ y: isOnView ? -100 : -100, opacity: isOnView ? 0 : 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        className={`flex    border-b border-white/5 w-full items-center ${style}`}
      >
        <div className="w-[16vw] mr-10 pl-5">
          <Logo styleD={"w-8 h-6 text-[6px] "} />
        </div>
        <div className="flex   gap-10  items-center w-full ">
          {[
            {
              title: "profile",
              actions: [
                {
                  icon: icfy.msg.casual,
                  name: "Notifications",
                  href: `/profile/${cv}/notifications`,
                },
                {
                  name: "Settings",
                  icon: icfySETTINGS,
                  href: `/profile/${cv}/settings`,
                },
              ],
              arr: [
                {
                  name: "Workspace",
                  description: "Get a better understanding of your traffic",
                  href: `/profile/${cv}`,
                },

                {
                  name: "Escrows",
                  description: "Connect with third-party tools",
                  href: `/profile/${cv}/escrows`,
                  icon: icsystem.escrow,
                },
                {
                  name: "Launchpads",
                  description: "Connect with third-party tools",
                  href: `/profile/${cv}/escrows`,

                  icon: icsystem.launchpad,
                },
              ],
            },
            {
              title: "marketplace",
              arr: [
                {
                  name: "To do",
                  description: "Coming soon",
                  href: "#",
                },
              ],
            },
            {
              title: "social",
              arr: [
                {
                  name: "Community",
                  description: "Coming soon",
                  href: "#",
                  icon: icfy.msg.post,
                },
                {
                  icon: icfy.person.team,
                  name: "My profile",
                  description: "Get a better understanding of your traffic",
                  href: `/profile/${cv}/social`,
                },
                {
                  icon: icfy.msg.casual,
                  name: "Messages",
                  description: "Get a better understanding of your traffic",
                  href: `/profile/${cv}/messages`,
                },
              ],
            },
            {
              title: "about",

              arr: [
                {
                  icon: icsystem.escrow,
                  name: "Disputes",
                  description: "Get a better understanding of your traffic",
                },

                {
                  name: "Missions",
                  description: "Connect with third-party tools",
                },
                {
                  name: "Social",
                  description: "Connect with third-party tools",
                },
                {
                  name: "Courts",
                  description: "Connect with third-party tools",
                },
                {
                  name: "Launchpads",
                  description: "Coming soon",
                },
              ],
            },
            {
              title: "search",
              arr: [
                {
                  name: "Freelancers",
                  description: "Lorem ipsium dolor et",
                  href: "/search",
                },
                {
                  name: "Missions",
                  description: "Lorem ipsium dolor et",
                  href: "/search/jobs",
                },
                {
                  name: "Courts",
                  description: "Coming soon",
                },
                {
                  name: "Launchpads",
                  description: "Lorem ipsium dolor et",
                  href: "/search/launchpads",
                },
              ],
            },
            {
              title: "create",
              arr: [
                {
                  name: "Mission",
                  description: "Launch a project with AI assist",
                  href: "/create/mission",
                  icon: icsystem.mission,
                },
                {
                  icon: icsystem.profile,
                  name: "Account",
                  description: "Join our community",
                  href: `/create/profile`,
                },
                {
                  icon: icsystem.launchpad,
                  name: "Launchpad",
                  description: "Launch a project with our community",
                  href: `/create/launchpad`,
                },
                {
                  icon: icsystem.escrow,
                  name: "Escrow",
                  description:
                    "Declare a dispute between you and workers or project manager",
                  href: `/create/escrow`,
                },
              ],
            },
          ].map((el) => (
            <Element object={el} key={v4()}>
              {el}
            </Element>
          ))}
          <div className="ml-auto mr-10">
            {cv ? (
              <Avatar
                metadatas={metadatas}
                CID={metadatas?.avatar}
                style={"w-12 "}
              />
            ) : (
              <BtnAuth />
            )}
          </div>
        </div>

        <MyProgress style="progress bg-white/40 opacity-50   w-[97%]  absolute bottom-0 " />
      </motion.header>
    </>
  );
};
