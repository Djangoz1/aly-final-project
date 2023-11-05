"use client";
// import { Header } from "sections/Layout/Header";
// import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
// import { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { Hero } from "sections/Hero";
// import { Missions } from "sections/Missions";
import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";
import { styles } from "styles/style";
import { Icon } from "@iconify/react";
import { Logo, LogoIc } from "components/Logo";
import { LinearGradient } from "react-text-gradients";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { icfy, icfyARROWD, icfyCODE, icfyETHER, icfyROCKET } from "icones";
import { MyCard } from "components/myComponents/card/MyCard";
import {
  BtnGb1,
  BtnGr1,
  BtnGb2,
  BtnGr2,
} from "components/myComponents/btn/MyGradientButton";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { Scene } from "spline/Scene";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";

import Link from "next/link";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { useEffect, useState } from "react";
import { _apiGet, _apiGetAt } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { useToolsDispatch, useToolsState } from "context/tools";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";

export default function Home() {
  // const { address, isConnected } = useAccount();
  // const { cv } = useAuthState();
  // const dispatch = useAuthDispatch();

  const [isState, setIsState] = useState(null);
  const dispatch = useToolsDispatch();
  const { state } = useToolsState();

  useEffect(() => {
    if (isState === null)
      (async () => {
        setIsState({
          price: {
            launchpad: ethers.utils.formatEther(
              await _apiGetAt({
                func: "launchpadPrice",
                targetContract: "balancesHub",
                address: ADDRESSES.balancesHub,
              })
            ),
            mission: ethers.utils.formatEther(
              await _apiGetAt({
                func: "missionPrice",
                targetContract: "balancesHub",
                address: ADDRESSES.balancesHub,
              })
            ),
          },
          lengths: {
            cv: await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]),
            mission: await _apiGet("tokensLengthOf", [
              ADDRESSES["missionsHub"],
            ]),
            launchpad: await _apiGet("tokensLengthOf", [
              ADDRESSES["launchpadsHub"],
            ]),
            pub: await _apiGet("tokensLengthOf", [ADDRESSES["pubsHub"]]),
            disputes: await _apiGet("tokensLengthOf", [
              ADDRESSES["disputesHub"],
            ]),
          },
        });
      })();
  }, []);

  let [isPrices, setIsPrices] = useState(null);

  useEffect(() => {
    if (!isPrices) {
      (async () => {
        setIsPrices({
          launchpad: ethers.utils.formatEther(
            await _apiGetAt({
              func: "launchpadPrice",
              targetContract: "balancesHub",
              address: ADDRESSES.balancesHub,
            })
          ),
          mission: ethers.utils.formatEther(
            await _apiGetAt({
              func: "missionPrice",
              targetContract: "balancesHub",
              address: ADDRESSES.balancesHub,
            })
          ),
        });
      })();
    }
  }, []);

  return (
    <>
      {/* <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div> */}

      <MyLayoutApp notLoad={true} initState={isState} url={`/`} target={"home"}>
        <>
          <Viewport
            img={{
              image: (
                <div className="-z-1 h-screen w-screen top-0 left-0 absolute  opacity-20 ">
                  <div className="absolute inset-0  backdrop-blur-[1px]   rounded-full  bg-[url('/background.gif')]  bg-repeat"></div>
                </div>
              ),
            }}
            full={true}
            id={"hero"}
          >
            <div className="relative w-full px-4 py-32 sm:px-6 flex items-end lg:px-8 mt-auto">
              <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                <h1
                  className={
                    "pb-4 text-4xl font-light  md:text-6xl uppercase text-left"
                  }
                >
                  <LinearGradient
                    className="font-ligth"
                    gradient={[
                      "to left",
                      "rgba(191,208,191,1), rgba(62,62,62,1)",
                    ]}
                  >
                    Where <span className="font-semibold">Blockchain</span>
                    {/* <br /> */}
                    <br />
                    meets Social
                    <br />
                    <span className="font-semibold">Freeancing</span>
                  </LinearGradient>
                </h1>

                <p className=" max-w-lg text-left">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nesciunt illo tenetur fuga ducimus numquam ea!
                </p>

                <div className="mt-8 flex flex-wrap gap-4 text-center">
                  <MyMainBtn icon={{ no: true }} template={1}>
                    Learn More
                  </MyMainBtn>
                  <MyMainBtn template={1} color={1}>
                    Get Started
                  </MyMainBtn>
                </div>
              </div>
            </div>
          </Viewport>
          <Viewport full={true} id={"hero"} index={0}>
            <header className="relative">
              <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
                <div className="mx-auto  flex flex-col items-center max-w-3xl text-center">
                  <h1
                    className={
                      "mb-6 pb-4 text-4xl font-bold text-white md:text-6xl " +
                      styles.hero
                    }
                  >
                    {/* <div className={"w-full " + styles.hero}> */}

                    <LinearGradient
                      className="font-ligth"
                      gradient={[
                        "to left",
                        "rgba(191,208,191,1), rgba(219,224,219,1)",
                      ]}
                    >
                      Where <span className="font-semibold">Blockchain</span>
                      {/* <br /> */}
                      <br />
                      meets Social
                      <br />
                      <span className="font-semibold">Freelancing</span>
                    </LinearGradient>
                    {/* </div> */}
                  </h1>
                  <LinearGradient
                    className="mx-auto mb-5 w-full text-xl text-[#636262] lg:mb-8   font2 uppercase"
                    gradient={[
                      "to right",
                      "rgba(201,78,21,0.92), rgba(161,173,161,1)",
                    ]}
                  >
                    Boost your startups from scratch
                  </LinearGradient>

                  <MyMainBtn color={2} template={1}>
                    Get Started
                  </MyMainBtn>
                </div>

                <div className="mx-auto mt-16 grid max-w-[1040px] grid-cols-2 gap-8 py-20 sm:grid-cols-3 sm:gap-12 md:grid-cols-5">
                  <div className="mx-auto">
                    <img
                      src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a267_Microsoft%20Logo.svg"
                      alt=""
                      className="inline-block"
                    />
                  </div>
                  <div className="mx-auto">
                    <img
                      src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a26a_PayPal%20Logo.svg"
                      alt=""
                      className="inline-block"
                    />
                  </div>
                  <div className="mx-auto">
                    <img
                      src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a268_Google%20Logo.svg"
                      alt=""
                      className="inline-block"
                    />
                  </div>
                  <div className="mx-auto">
                    <img
                      src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a269_Chase%20Logo.svg"
                      alt=""
                      className="inline-block"
                    />
                  </div>
                  <div className="mx-auto">
                    <img
                      src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a26b_Walmart%20Logo.svg"
                      alt=""
                      className="inline-block"
                    />
                  </div>
                </div>
              </div>
            </header>
          </Viewport>
          <Viewport full={true} id={"hero"} index={1}>
            <section className="relative text-white">
              <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
                <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
                  <h1
                    className={
                      "mb-6 pb-4 text-4xl font-bold text-white md:text-5xl " +
                      styles.hero
                    }
                  >
                    Backed <Hg>up</Hg> by real <Hg>data</Hg>
                    <br />
                  </h1>
                  <p className="mx-auto mt-4 max-w-[528px] text-[#636262]">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit ut
                    aliquam,purus sit amet luctus magna fringilla urna
                  </p>
                </div>

                <div className="py- lg:grid-cols-48 mx-auto grid w-full max-w-[960px] grid-cols-1 gap-5 px-16 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
                  <div className="flex flex-col items-center gap-4">
                    <p>Accounts</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(state?.lengths?.cv)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Posts</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(state?.lengths?.pub)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Missions</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(state?.lengths?.mission)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Escrow Tickets</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(state?.lengths?.disputes)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>
                  <div className=""></div>
                </div>
              </div>
            </section>
          </Viewport>

          <Viewport full={true} id={"hero"} index={2}>
            <div className="  w-full  backdrop-blur rounded-full  my-auto flex items-end   ">
              <div className="mr-auto  ">
                <Hg style={"uppercase font-semibold "}>Powered by community</Hg>
                <h1
                  className={
                    styles.hero +
                    " text-4xl font-bold text-white md:text-5xl w-fit "
                  }
                >
                  <LinearGradient
                    className="font-ligth"
                    gradient={[
                      "to left",
                      "rgba(191,208,191,1), rgba(62,62,62,1)",
                    ]}
                  >
                    Create &amp;
                    <br />
                    <span className="font-semibold">challenging</span>
                    <br />
                    projects
                  </LinearGradient>
                </h1>
                <p className="text-sm font-light normal-case max-w-[400px] whitespace-pre-wrap mt-4">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
                  cumque corrupti eligendi velit voluptatum temporibus rerum.
                  Omnis, blanditiis in beatae ad vero dolores praesentium
                  deserunt ab earum ratione commodi dignissimos.
                </p>
              </div>
              <MyCardList
                color={0}
                url={"/create/launchpad"}
                btn={{
                  title: "Create launchpad",
                  info: "30 days money-back guarantee",
                }}
                arr={[
                  { icon: icfy.work.casual, title: "Simplified Onboarding" },
                  { icon: icfyCODE, title: "Enhanced Visibility" },
                  { icon: icfy.ux.mediation, title: "Manage workflow" },
                  { icon: icfy.court.injustice, title: "Decentralization" },
                  { icon: icfy.bank.bag, title: "Community funding" },
                ]}
                price={state?.price?.launchpad}
              ></MyCardList>
            </div>
          </Viewport>
          <Viewport full={true} id={"hero"} index={3}>
            <div className=" w-full   flex relative items-end my-auto   ">
              <div className="flex w-4/5">
                <MyCardPrice
                  size={"w-1/4"}
                  style={" -z-1 hover:z-100 relative hover:mr-10 "}
                  color={2}
                  lists={[
                    {
                      title: "Open for all",
                      check: true,
                    },
                    {
                      title: "Earn token ERC20",
                      check: true,
                    },
                    {
                      title: "Protect by protocole",
                      check: false,
                    },
                    {
                      title: "Token ERC20 accept",
                      check: false,
                    },
                  ]}
                  url={"/create/launchpad"}
                  price={state?.price?.launchpad}
                  badge={{ title: "Launchpad", icon: icfyROCKET }}
                />
                <MyCardPrice
                  size={"w-1/4"}
                  style={
                    " -z-1 hover:z-100 relative hover:mr-10 hover:ml-0 -ml-4"
                  }
                  color={3}
                  active={true}
                  lists={[
                    {
                      title: "Open for all",
                      check: true,
                    },
                    {
                      title: "Earn token ERC20",
                      check: true,
                    },
                    {
                      title: "Protect by protocole",
                      check: true,
                    },
                    {
                      title: "Token ERC20 accept",
                      check: true,
                    },
                  ]}
                  url={"/create/mission"}
                  price={state?.price?.mission}
                  badge={{ title: "Freelance", icon: icfy.work.casual }}
                />
                <MyCardPrice
                  size={"w-1/4"}
                  style={
                    " -z-1 hover:z-100 relative hover:mr-10 hover:ml-0 -ml-4"
                  }
                  color={1}
                  lists={[
                    {
                      title: "Open for all",
                      check: false,
                    },
                    {
                      title: "Earn token ERC20",
                      check: true,
                    },
                    {
                      title: "Protect protocole",
                      check: true,
                    },
                    {
                      title: "Token ERC20 accept",
                      check: true,
                    },
                  ]}
                  badge={{ title: "Escrow", icon: icfy.court.injustice }}
                />
                <MyCardPrice
                  size={"w-1/4"}
                  style={" -z-1 hover:z-100 relative hover:ml-0 -ml-4"}
                  color={0}
                  lists={[
                    {
                      title: "Open for all",
                      check: true,
                    },
                    {
                      title: "Earn token ERC20",
                      check: true,
                    },
                    {
                      title: "Protect by protocole",
                      check: false,
                    },
                    {
                      title: "Token ERC20 accept",
                      check: false,
                    },
                  ]}
                  badge={{ title: "Social", icon: icfy.msg.chat }}
                />
              </div>
              <div className=" backdrop-blur rounded-full  absolute bottom-0 w-1/5 right-0 max-w-3xl text-center ">
                <h1
                  className={
                    "mb-4   text-end font-bold text-white text-4xl  uppercase font2 whitespace-nowrap w-full  leading-tight"
                  }
                >
                  <LinearGradient
                    className="font-ligth"
                    gradient={[
                      "to left",
                      "rgba(191,208,191,1), rgba(62,62,62,1)",
                    ]}
                  >
                    Our
                    <br />
                    <span className="font-semibold">protocoles</span>
                  </LinearGradient>
                </h1>
                <div className="mt-4 text-right">
                  <p className="c4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                    voluptas dolores voluptatem a mollitia deleniti nihil.
                  </p>
                </div>
              </div>
            </div>
          </Viewport>
          <Viewport full={true} id={"hero"} index={4}>
            <div className="w-full rounded-full backdrop-blur-[3px] my-auto flex items-end    ">
              <div className="flex flex-col w-2/5 text-left ">
                <Hg style={"uppercase font-semibold w-fit"}>
                  Powered by community
                </Hg>
                <h1
                  className={
                    styles.hero +
                    "  text-4xl font-bold text-white md:text-5xl w-fit   "
                  }
                >
                  <LinearGradient
                    className="font-ligth"
                    gradient={[
                      "to left",
                      "rgba(191,208,191,1), rgba(62,62,62,1)",
                    ]}
                  >
                    build &amp;
                    <br />
                    <span className="font-semibold">work</span> with
                    <br />
                    <span className="font-semibold">community</span>
                  </LinearGradient>
                  {/* <div className={"w-full " + styles.hero}> */}
                </h1>
                <p className="text-[#636262]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quibusdam iure expedita aspernatur suscipit nostrum quam
                  dolorem. Quisquam, itaque magni? Eos ducimus voluptatem
                  dignissimos eveniet blanditiis, voluptate magni debitis quia
                  harum!{" "}
                </p>
              </div>

              <MyCardList
                color={0}
                style={"ml-auto "}
                url={"/create/mission"}
                btn={{
                  title: "Create mission",
                  info: "30 days money-back guarantee",
                }}
                arr={[
                  { icon: icfy.work.casual, title: "Create mission" },
                  { icon: icfyCODE, title: "Hire worker" },
                  { icon: icfy.ux.mediation, title: "Manage workflow" },
                  { icon: icfy.court.injustice, title: "Declare dispute" },
                  {
                    icon: icfy.court.hammer,
                    title: "Integrate court",
                    description: "Finish job to integrate court",
                  },
                ]}
                price={state?.price?.mission}
              ></MyCardList>
            </div>
          </Viewport>
        </>
      </MyLayoutApp>
    </>
  );
}
