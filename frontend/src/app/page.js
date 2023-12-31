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

import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyNum } from "components/myComponents/text/MyNum";
import { HeroScroll } from "sections/Hero/HeroScrollPreview";

import { Header } from "sections/Layout/Header";

import { MyFooter } from "components/myComponents/layout/MyFooter";
import { MyCard } from "components/myComponents/card/MyCard";

import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";
import { LayoutTools } from "sections/Layout/LayoutTools";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyCardStars } from "components/myComponents/card/MyCardStars";
import { FlowUI } from "sections/home/FlowUI";
import { BentoUI } from "sections/home/BentoUI";

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
      <div className="bg-black ">
        <>
          <section className="min-h-screen flex flex-col gap-10 pb-[10vh] px-[10%] w-screen  relative ">
            <FlowUI />
            <BentoUI />
          </section>

          <section className=" min-h-screen   flex items-end ">
            <Example />
          </section>
          <section className="min-h-screen magicpattern  w-screen relative  ">
            <div className="-z-1 h-screen w-screen top-0 left-0 absolute  opacity-50 ">
              <img src="/bg1.webp" className="w-full h-full" />
              {/* <div className="absolute inset-0  backdrop-blur-[1px]   rounded-full  bg-[url('/background.gif')]  bg-repeat"></div> */}
            </div>
            <HeroScroll />
          </section>
          <section className="min-h-screen relative ">
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

          <section className="magicpattern   py-20 px-4">
            <div className="grid lg:grid-cols-4 xs:grid-cols-1 sm:grid-cols-2 gap-5 w-full">
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

          <section className=" h-screen">
            <MyFooter />
          </section>
        </>
      </div>
    </LayoutTools>
  );
}

let Example = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible w-full lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <MySub
                style={"c1"}
                size={14}
                className="text-base font-semibold leading-7 text-indigo-600"
              >
                AI assistance
              </MySub>
              <MyTitle style={"c1 text-4xl"}>Build project with Aly</MyTitle>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque
                id at vitae feugiat egestas.
              </p>
            </div>
          </div>
        </div>
        <div className="  p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <MyCardStars title={"Whitepaper"}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit!
          </MyCardStars>
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
              <p>
                Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                Id dolor praesent donec est. Odio penatibus risus viverra tellus
                varius sit neque erat velit. Faucibus commodo massa rhoncus,
                volutpat. Dignissim sed eget risus enim. Mattis mauris semper
                sed amet vitae sed turpis id.
              </p>
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <Icon
                    icon={icfy.ux.admin}
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />

                  <span>
                    <strong className="font-semibold text-gray-900">
                      Push to deploy.
                    </strong>{" "}
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Maiores impedit perferendis suscipit eaque, iste dolor
                    cupiditate blanditiis ratione.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <Icon
                    icon={icfy.ux.admin}
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />

                  <span>
                    <strong className="font-semibold text-gray-900">
                      SSL certificates.
                    </strong>{" "}
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                    qui lorem cupidatat commodo.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <Icon
                    icon={icfy.ux.admin}
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Database backups.
                    </strong>{" "}
                    Ac tincidunt sapien vehicula erat auctor pellentesque
                    rhoncus. Et magna sit morbi lobortis.
                  </span>
                </li>
              </ul>
              <p className="mt-8">
                Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis
                odio id et. Id blandit molestie auctor fermentum dignissim.
                Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate
                et ultrices hac adipiscing egestas. Iaculis convallis ac tempor
                et ut. Ac lorem vel integer orci.
              </p>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                No server? No problem.
              </h2>
              <p className="mt-6">
                Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam
                consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod
                vitae interdum mauris enim, consequat vulputate nibh. Maecenas
                pellentesque id sed tellus mauris, ultrices mauris. Tincidunt
                enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
                turpis ipsum eu a sed convallis diam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
