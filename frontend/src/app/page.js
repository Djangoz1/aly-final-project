"use client";

import { styles } from "styles/style";
import { Icon } from "@iconify/react";

import { LinearGradient } from "react-text-gradients";
import { Hg } from "components/text/HeroGradient";
import { icfy, icfyCODE, icfyROCKET } from "icones";

import { useEffect, useState } from "react";
import { _apiGet, _apiGetAt } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { useToolsDispatch, useToolsState } from "context/tools";

import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
import { HeroScroll } from "sections/Hero/HeroScrollPreview";

import { Header } from "sections/Layout/Header";

import { MyFooter } from "components/myComponents/layout/MyFooter";
import { MyCard } from "components/myComponents/card/MyCard";

import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";
import { LayoutTools } from "sections/Layout/LayoutTools";

export default function Home() {
  const [isState, setIsState] = useState(null);

  useEffect(() => {
    if (isState === null)
      (async () => {
        let lengths = {
          cv: await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]),
          mission: await _apiGet("tokensLengthOf", [ADDRESSES["missionsHub"]]),
          launchpad: await _apiGet("tokensLengthOf", [
            ADDRESSES["launchpadHub"],
          ]),
          pub: await _apiGet("tokensLengthOf", [ADDRESSES["pubsHub"]]),
          disputes: await _apiGet("tokensLengthOf", [ADDRESSES["disputesHub"]]),
        };

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
          lengths,
        });
      })();
  }, []);

  return (
    <LayoutTools>
      <div className="snap-y">
        <>
          <section
            full={true}
            className="min-h-screen w-screen snap-center relative "
          >
            <div className="-z-1 h-screen w-screen top-0 left-0 absolute  opacity-50 ">
              <img
                src="/bg1.webp"
                className="absolute inset-[0%] h-full w-full"
              />
              {/* <div className="absolute inset-0  backdrop-blur-[1px]   rounded-full  bg-[url('/background.gif')]  bg-repeat"></div> */}
            </div>
            <div className=" mx-auto relative z-2 flex flex-col items-center justify-center text-center   ">
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

                  <MyMainBtn url={"/create/profile"} color={2} template={1}>
                    Get Started
                  </MyMainBtn>
                </div>
              </div>
            </div>
          </section>
          <section className="min-h-screen magicpattern h-[200vh] w-screen relative snap-start ">
            <div className="-z-1 h-screen w-screen top-0 left-0 absolute  opacity-50 ">
              <img src="/bg1.webp" className="w-full h-full" />
              {/* <div className="absolute inset-0  backdrop-blur-[1px]   rounded-full  bg-[url('/background.gif')]  bg-repeat"></div> */}
            </div>
            <HeroScroll />
            <div className="py-20  flex  px-4 relative  w-screen ">
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
              <div className="flex ml-auto m-20 mt-0 flex-col gap-3">
                {[
                  { icon: icfy.work.casual, title: "Simplified Onboarding" },
                  { icon: icfyCODE, title: "Enhanced Visibility" },
                  { icon: icfy.ux.mediation, title: "Manage workflow" },
                  { icon: icfy.court.injustice, title: "Decentralization" },
                  { icon: icfy.bank.bag, title: "Community funding" },
                ].map((el) => (
                  <MyCard
                    styles="flex gap-2 px-4 w-full py-2 items-center"
                    key={v4()}
                  >
                    <Icon icon={el.icon} />
                    <MySub style="c4">{el.title}</MySub>
                  </MyCard>
                ))}
              </div>
            </div>
          </section>
          <section className="min-h-screen relative snap-center">
            <div className="-z-1 h-screen w-screen flex justify-center top-0 left-0 absolute opacity-20  ">
              <img src="/bg4.png" className="w-full h-full" />
            </div>
            <div className="backdrop-blur-2xl  absolute bottom-0 left-0  py-10 flex gap-8 w-screen ">
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
            <div className="relative text-white">
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
                      <MyNum num={parseInt(isState?.lengths?.cv)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Posts</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(isState?.lengths?.pub)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Missions</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(isState?.lengths?.mission)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p>Escrow Tickets</p>
                    <div className="mb-4 mt-6 flex text-3xl font-extrabold md:text-5xl">
                      <MyNum num={parseInt(isState?.lengths?.disputes)} />
                      <span className="text-[#c9fd02]">+</span>
                    </div>
                  </div>
                  <div className=""></div>
                </div>
              </div>
            </div>
          </section>
          <section className="magicpattern h-screen snap-start py-20 px-4">
            <h1
              className={
                "mx-auto mb-4 text-center   font-bold w-1/5 text-white text-4xl  uppercase font2 whitespace-nowrap   leading-tight"
              }
            >
              <LinearGradient
                className="font-ligth"
                gradient={["to left", "rgba(191,208,191,1), rgba(62,62,62,1)"]}
              >
                Our
                <br />
                <span className="font-semibold">protocoles</span>
              </LinearGradient>
            </h1>
            <div className="flex gap-5 w-full">
              <MyCardPrice
                size={"w-1/4"}
                template={0}
                style={"  relative  "}
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
                price={isState?.price?.launchpad}
                badge={{ title: "Launchpad", icon: icfyROCKET }}
              />
              <MyCardPrice
                size={"w-1/4"}
                style={"  relative "}
                template={1}
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
                price={isState?.price?.mission}
                badge={{ title: "Freelance", icon: icfy.work.casual }}
              />
              <MyCardPrice
                size={"w-1/4"}
                style={"  relative "}
                color={0}
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
                template={1}
                size={"w-1/4"}
                style={" relative"}
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
          </section>
          <section className="snap-start h-screen magicpattern py-20 flex items-end px-4">
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
            <div className="flex ml-auto m-20 mt-0 flex-col gap-3">
              {[
                { icon: icfy.work.casual, title: "Create mission" },
                { icon: icfyCODE, title: "Hire worker" },
                { icon: icfy.ux.mediation, title: "Manage workflow" },
                { icon: icfy.court.injustice, title: "Declare dispute" },
                {
                  icon: icfy.court.hammer,
                  title: "Integrate court",
                  description: "Finish job to integrate court",
                },
              ].map((el) => (
                <MyCard
                  styles="flex gap-2 px-4 w-full py-2 items-center"
                  key={v4()}
                >
                  <Icon icon={el.icon} />
                  <MySub style="c4">{el.title}</MySub>
                </MyCard>
              ))}
            </div>
          </section>
          <section className="snap-end h-screen">
            <MyFooter />
          </section>
        </>
        <div className="fixed top-0 left-0 w-full">
          <Header />
        </div>
      </div>
    </LayoutTools>
  );
}
