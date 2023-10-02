"use client";
import { CreateProfile } from "sections/Profile/form/create/CreateProfile";
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
import { LogoIc } from "components/Logo";
import { LinearGradient } from "react-text-gradients";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { icfy, icfyROCKET } from "icones";
import { MyCard } from "components/myComponents/card/MyCard";
import {
  BtnGb1,
  BtnGr1,
  BtnGb2,
  BtnGr2,
} from "components/myComponents/btn/MyGradientButton";

export default function Home() {
  // const { address, isConnected } = useAccount();
  // const { cv } = useAuthState();
  // const dispatch = useAuthDispatch();

  // const spans = ["community", "confidence", "efficiency"];
  // const [isSpan, setIsSpan] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsSpan(isSpan + 1 < spans.length ? isSpan + 1 : 0);
  //   }, 5000);
  // }, [isSpan]);

  // useEffect(() => {
  //   if (cv) {
  //     doAuthMission(dispatch, cv);
  //   }
  // }, [cv]);

  return (
    <>
      <Layout>
        <>
          <MySection styles={"justify-start font2 flex flex-col"}>
            <div className="w-full relative mb-[10vh] flex">
              <div className="blob1 w-[400px] h-[500px] rotate-90 absolute top-0 right-0"></div>
              <div className="blob2 w-[400px] h-[300px] rotate-90 absolute top-0 left-2/4"></div>
              <div className="blobi absolute w-[600px] h-[600px] right-10 -top-1/3 "></div>

              <div className="w-full  mr-10">
                <LinearGradient
                  className="text-xs font2 uppercase"
                  gradient={[
                    "to right",
                    "rgba(201,78,21,0.92), rgba(201,21,103,1)",
                  ]}
                >
                  Boost your startups from scratch
                </LinearGradient>
                <h2 className={styles.hero}>
                  Where
                  <br />
                  <Hg>Blockchain</Hg>
                  <br />
                  meets Social
                  <br />
                  <Hg>Freelancing</Hg>
                </h2>
                <div className=" mt-5 ml-auto">
                  <BtnGr1 style=" mr-10">
                    <Icon icon={icfy.work.casual} className={""} />
                    Launch project
                  </BtnGr1>

                  <CreateProfile />
                </div>
              </div>
              {/* <img
                src="/hero.jpeg"
                className="h-fit w-[600px]  mask mask-hexagon rounded-lg"
              /> */}
            </div>

            <div
              className="presentation  my-[10vh] "
              id="freelance-presentation"
            >
              <h2 className={`text-center font-light text-[34px] mb-[6vh]`}>
                Contribute to <Hg>innovative</Hg> and <Hg>challenging</Hg>{" "}
                projects
              </h2>

              <ul className="m-0 p-0">
                <li>
                  <div className="title">
                    <Icon icon={icfy.person.team} className="icons" />
                    <Hg style={"font-light"}>Collaborative Project Building</Hg>
                  </div>
                  <div className="subtitle hover:text-white">
                    Join projects where your opinion matters and become an
                    integral part of a team
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.ux.experiment} className="icons" />
                    <Hg style={"font-light"}>
                      Exciting and Innovative Projects
                    </Hg>
                  </div>
                  <div className="subtitle hover:text-white">
                    Discover a variety of new interesting and cutting-edge
                    projects
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.ux.mediation} className="icons" />
                    <Hg style={"font-light"}>Efficient Mediation System</Hg>
                  </div>
                  <div className="subtitle hover:text-white">
                    Count on our reliable mediation system, ensuring effective
                    conflict resolution and seamless communication
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.eye.open} className="icons" />
                    <Hg style={"font-light"}>Enhanced Visibility</Hg>
                  </div>
                  <div className="subtitle hover:text-white">
                    Increase your professional visibility and connect with a
                    wider range of clients and opportunities
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfyROCKET} className="icons" />
                    <Hg style={"font-light"}>Simplified Onboarding</Hg>
                  </div>
                  <div className="subtitle hover:text-white">
                    Getting started is a breeze, thanks to our user-friendly and
                    straightforward onboarding process
                  </div>
                </li>
              </ul>
            </div>
            <div className=" my-[10vh] font2">
              <h2 className={`text-center font-light text-[34px] mb-[6vh]`}>
                <Hg1>Services</Hg1>
              </h2>
              <div className="flex justify-evenly">
                <MyCard styles={"w-[23%]"}>
                  <Icon
                    icon={icfy.work.casual}
                    className="text-info text-[90px]"
                  />
                  <div className="w-full  mt-6 mb-6">
                    <Hg1 style={"w-full  text-2xl"}>
                      Freelance <br />
                      Protocole
                    </Hg1>
                    <div className="g1 gb1 mt-3 w-full py-[1px] "></div>
                  </div>
                  <p className="text-xs w-3/4 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Autem fuga quae suscipit ullam aliquam officia eligendi
                    dolor temporibus!
                  </p>
                  <BtnGb2 style="mt-5 w-full btn-sm">More</BtnGb2>
                </MyCard>
                <MyCard styles={"w-[23%]"}>
                  <Icon
                    icon={icfy.court.hammer}
                    className="text-error text-[90px]"
                  />
                  <div className="w-full  mt-6 mb-6">
                    <Hg style={"w-full  text-2xl"}>
                      Escrow <br />
                      Protocole
                    </Hg>
                    <div className="g1 gr1 mt-3 w-full py-[1px] "></div>
                  </div>
                  <p className="text-xs w-3/4 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Autem fuga quae suscipit ullam aliquam officia eligendi
                    dolor temporibus!
                  </p>
                  <BtnGr2 style=" mt-5 w-full btn-sm  ">More</BtnGr2>
                </MyCard>
                <MyCard styles={"w-[23%]"}>
                  <Icon
                    icon={icfy.msg.chat}
                    className="text-info text-[90px]"
                  />
                  <div className="w-full mt-6 mb-6">
                    <Hg1 style={"w-full pr-10 text-2xl"}>
                      Social <br />
                      Protocole
                    </Hg1>
                    <div className="g1 gb1 mt-3 w-full py-[1px] "></div>
                  </div>
                  <p className="text-xs w-3/4 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Autem fuga quae suscipit ullam aliquam officia eligendi
                    dolor temporibus!
                  </p>
                  <BtnGb2 style="mt-5 w-full btn-sm">More</BtnGb2>
                </MyCard>
                <MyCard styles={"w-[23%]"}>
                  <Icon icon={icfyROCKET} className="text-error text-[90px]" />
                  <div className="w-full  mt-6 mb-6">
                    <Hg style={"w-full  text-2xl"}>
                      Launchpad <br />
                      Protocole
                    </Hg>
                    <div className="g1 gr1 mt-3 w-full py-[1px] "></div>
                  </div>
                  <p className="text-xs w-3/4 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Autem fuga quae suscipit ullam aliquam officia eligendi
                    dolor temporibus!
                  </p>
                  <BtnGr2 style="mt-5 w-full btn-sm">More</BtnGr2>
                </MyCard>
              </div>
            </div>

            <div
              className="presentation  my-[10vh] "
              id="project-owner-presentation"
            >
              <h2 className={`text-center font-light text-[34px] mb-[6vh]`}>
                Empowering the <Hg1>next</Hg1> generation of{" "}
                <Hg1>Innovators</Hg1>
              </h2>

              <ul className="m-0 p-0">
                <li>
                  <div className="title">
                    <Icon icon={icfy.ux.star} className="icons" />
                    <Hg1 style={"font-light"}>Launch your Dreams</Hg1>
                  </div>
                  <div className="subtitle hover:text-white">
                    We're here to support community innitiative for help to
                    launch your projects into the stratosphere.
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.bank.bag} className="icons" />
                    <Hg1 style={"font-light"}>Community Funding</Hg1>
                  </div>
                  <div className="subtitle hover:text-white">
                    Discover a variety of new interesting and cutting-edge
                    projects
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.domain.blockchain} className="icons" />
                    <Hg1 style={"font-light"}>Decentralization</Hg1>
                  </div>
                  <div className="subtitle hover:text-white">
                    Count on our reliable mediation system, ensuring effective
                    conflict resolution and seamless communication
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfy.eye.open} className="icons" />
                    <Hg1 style={"font-light"}>Enhanced Visibility</Hg1>
                  </div>
                  <div className="subtitle hover:text-white">
                    Increase your professional visibility and connect with a
                    wider range of clients and opportunities
                  </div>
                </li>
                <li>
                  <div className="title">
                    <Icon icon={icfyROCKET} className="icons" />
                    <Hg1 style={"font-light"}>Simplified Onboarding</Hg1>
                  </div>
                  <div className="subtitle hover:text-white">
                    Getting started is a breeze, thanks to our user-friendly and
                    straightforward onboarding process
                  </div>
                </li>
              </ul>
            </div>
          </MySection>

          <LogoIc
            styles={
              "absolute text-[600px] top-1/2 left-1/2 -z-10 opacity-[0.6%] -translate-y-1/2 -translate-x-1/2"
            }
          />

          {/* <Hero />

          <div className="w-[90%] h-screen flex flex-col justify-evenly mx-auto">
            <h6 className="text-white text-center text-[35px] font-prim font-bold">
              Wwwork with{" "}
              <span className="font-black text-primary">{spans[isSpan]}</span>
            </h6>
          </div>
          <Missions /> */}
        </>
      </Layout>
    </>
  );
}
