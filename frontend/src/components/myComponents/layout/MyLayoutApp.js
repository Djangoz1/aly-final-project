"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useViewportScroll } from "framer-motion";

import { v4 } from "uuid";
import { MyMenus1 } from "components/myComponents/menu/MyMenus";
import { useToolsDispatch, useToolsState } from "context/tools";
import { LayoutTools } from "sections/Layout/LayoutTools";

import { stateTools } from "utils/ui-tools/state-tools";
import { Viewport } from "./MyViewport";

import { Logo, LogoIc } from "components/Logo";

export let MyLayoutApp = ({
  id,
  url,
  background,
  particles,
  menus,
  notLoad,
  side,
  arr,
  ownerProfile,
  subMenus,
  target,
  children,
  initState,
}) => {
  // const controls = useAnimation();
  // const { scrollYProgress } = useViewportScroll();

  let [isState, setIsState] = useState(null);

  // const updateScaleX = () => {
  //   controls.start({
  //     scaleX: scrollYProgress.current,
  //     transition: {
  //       stiffness: 100,
  //       damping: 30,
  //       restDelta: 0.001,
  //     },
  //   });
  // };

  // // scrollYProgress.onChange(() => {
  // //   updateScaleX();
  // // });

  let fetch = async () => {
    let stateOrigin = await stateTools({
      id,
      url,
      pointer: 0,
      target: target,
      state: initState,
      arr,
    });
    setIsState(stateOrigin);
  };

  useEffect(() => {
    if (!notLoad && initState && !isState && url != initState?.url) {
      fetch();
      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [id, url]);

  let dispatch = useToolsDispatch();
  let tools = useToolsState();

  return (
    <LayoutTools
      state={{
        id,
        url,
        pointer: 0,
        target: target,
        state: initState,
        arr,
      }}
    >
      {/* <MyHeader /> */}
      {background ? (
        <img
          src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f68133fc5cb4e29ed28fa_Get%20Started%20BG.svg"
          alt=""
          className="fixed -z-[0] h-screen w-screen top-0 left-0 object-cover"
        />
      ) : undefined}
      {children}
      <Viewport
        img={{
          image: (
            <div
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f68133fc5cb4e29ed28fa_Get%20Started%20BG.svg"
              alt=""
              className="fixed bg-black -z-[0] h-full w-full object-cover"
            />
          ),
        }}
        full={true}
        id={"hero"}
        index={0}
      >
        <footer className=" w-full h-full flex  ">
          <div className="mx-auto w-full  px-5 pt-16 md:px-10 md:pt-24 h-fit mt-auto lg:pt-32 ">
            <div className="mb-12 inline-block max-w-full">
              <Logo />
            </div>
            <div className="grid grid-cols-[auto_1fr] justify-between gap-10 sm:grid-cols-3 lg:grid-cols-[0.45fr_auto_auto_auto]">
              <div className="flex max-w-[400px] flex-col gap-8 max-[991px]:[grid-area:span_1/span_3/span_1/span_3] max-[479px]:[grid-area:span_1/span_2/span_1/span_2]">
                <p className="text-[#636262]">
                  Lorem ipsum dolor sit amet, &nbsp;elit ut aliquam, purus sit
                  amet luctus
                </p>
                <div className="mx-0 mb-4 w-full">
                  <form
                    name="email-form"
                    method="get"
                    className="relative flex max-w-full items-center justify-center"
                  >
                    <input
                      type="email"
                      className="m-0 block h-full max-h-8 w-full rounded-lg border border-solid border-black bg-[#101010] px-3 py-6 align-middle text-sm text-[#333333] focus:border-[#3898ec] focus:outline-0"
                      maxLength="256"
                      name="email-4"
                      placeholder="Enter your email"
                      required=""
                    />
                    <div className="absolute bottom-[0%] left-[auto] right-[5%] top-[25%] text-[#c9fd02]">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.9752 3.02708C20.7866 2.83863 20.5512 2.70382 20.2932 2.63651C20.0353 2.5692 19.764 2.57182 19.5074 2.64411L2.0391 7.57102C1.74519 7.65391 1.48358 7.82454 1.28924 8.0601C1.0949 8.29565 0.977084 8.58491 0.951545 8.88922C0.926006 9.19353 0.993958 9.49838 1.14632 9.76303C1.29868 10.0277 1.52819 10.2395 1.80418 10.3702L9.11045 13.8311L14.1057 8.83591C14.2463 8.69525 14.4371 8.61623 14.636 8.61623C14.835 8.61623 15.0257 8.69525 15.1664 8.83591C15.3071 8.97657 15.3861 9.16735 15.3861 9.36628C15.3861 9.5652 15.3071 9.75598 15.1664 9.89664L10.1712 14.8919L13.6321 22.1981C13.7519 22.4552 13.9429 22.6726 14.1823 22.8246C14.4218 22.9767 14.6997 23.057 14.9834 23.0562C15.0263 23.0562 15.0696 23.0544 15.1131 23.0508C15.418 23.0269 15.708 22.9097 15.9439 22.7151C16.1798 22.5205 16.35 22.258 16.4313 21.9632L21.3582 4.49494C21.4304 4.2383 21.433 3.96707 21.3657 3.7091C21.2984 3.45112 21.1636 3.21572 20.9752 3.02708Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="submit"
                      value="Subscribe"
                      className="absolute bottom-[0%] left-[auto] right-[0%] top-[0%] m-0 inline-block cursor-pointer rounded-[60px] border border-solid border-[#c9fd02] bg-[#c9fd02] px-6 py-4 text-center font-bold text-black no-underline opacity-0 transition hover:border-black hover:bg-white"
                    />
                    <div></div>
                    <div></div>
                  </form>
                </div>
                <div>
                  <p className="font-bold uppercase text-[#c9fd02]">email us</p>
                  <p className="text-[#636262]">support@flowspark.co</p>
                </div>
              </div>
              <div className="flex flex-col items-start font-semibold">
                <p className="mb-4 text-xl text-white">Solution</p>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Marketing
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Analytics
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Commerce
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Insights
                </a>
              </div>
              <div className="flex flex-col items-start font-semibold">
                <p className="mb-4 text-xl text-white">Support</p>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Guides
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  API&nbsp;Status
                </a>
              </div>
              <div className="flex flex-col items-start font-semibold">
                <p className="mb-4 text-xl text-white">Company</p>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  About
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Jobs
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Press
                </a>
                <a
                  href="#"
                  className="py-2 text-sm font-bold text-[#636262] transition hover:text-white"
                >
                  Partners
                </a>
              </div>
            </div>
            <div className="mb-20  mt-20 w-full border border-solid border-[#101010]"></div>
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="flex-none">
                <p className="text-[#636262]">
                  © Copyright 2021. All rights reserved.
                </p>
              </div>
              <div className="text-center">
                <a
                  href="#"
                  className="inline-block py-2 pl-5 pr-0 font-bold text-[#636262] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="inline-block py-2 pl-5 pr-0 font-bold text-[#636262] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
                >
                  License
                </a>
                <a
                  href="#"
                  className="inline-block py-2 pl-5 pr-0 font-bold text-[#636262] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Viewport>
    </LayoutTools>
  );
};
export let MyLayoutApp1 = ({
  id,
  url,
  menus,

  arr,
  subMenus,
  target,
  children,
  initState,
}) => {
  const controls = useAnimation();
  const { scrollYProgress } = useViewportScroll();

  let [isState, setIsState] = useState(null);

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

  let fetch = async () => {
    let stateOrigin = await stateTools({
      id,
      url,
      pointer: 0,
      target: target,
      state: initState,
      arr,
    });
    setIsState(stateOrigin);
  };

  useEffect(() => {
    if (initState && !isState && url != initState?.url) {
      fetch();

      console.log("Anormal !!!! fetch is datas page", isState);
    }
  }, [id, url]);

  let dispatch = useToolsDispatch();
  let tools = useToolsState();

  return (
    <LayoutTools
      state={{
        id,
        url,
        pointer: 0,
        target: target,
        state: initState,
        arr,
      }}
    >
      <div className="fixed bottom-[15vh] z-0 flex flex-col items-end right-[10vw]">
        {/* <div className="flex mb-10">
          <MyMenus1 arr={subMenus} />
          <div className="mx-10"></div>
          <MyMenus2 arr={menus} />
        </div> */}
        {children}
      </div>
      <Viewport
        key={v4()}
        id={`${tools?.state?.[target]?.length} ${target
          .toString()
          .toUpperCase()}`}
        index={0}
      >
        <div className="overflow-y-hidden">{arr?.[0]?.component}</div>
      </Viewport>
      <motion.div className="progress" animate={controls} />
    </LayoutTools>
  );
};
