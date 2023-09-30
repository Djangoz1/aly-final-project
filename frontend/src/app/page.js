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
import { Hg } from "components/text/HeroGradient";

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
          <MySection styles={"justify-start flex flex-col"}>
            <div className="w-full flex">
              <div className="w-fit  mr-10">
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
                  <CreateProfile />

                  <button className="cta-button ml-10 project-owner">
                    Launch my project
                  </button>
                </div>

                {/* <div className="presentation font2">
                  <h1 className="gradient-primary">
                    The social freelancing platform
                  </h1>

                  <h3>
                    Be at the heart of the revolution -{" "}
                    <b className={"bold"}>deWork</b> is a place where every
                    innovative idea{" "}
                    <b className={"bold"}>finds its developers</b>, every talent
                    can <b className={"bold"}>join any project</b> and be
                    valued, and where investors{" "}
                    <b className={"bold"}>shape the future</b> and get involved
                    at each step.
                  </h3>
                </div> */}
              </div>
              <img
                src="/hero.avif"
                className="h-fit w-[800px]  mask mask-hexagon rounded-lg"
              />
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
