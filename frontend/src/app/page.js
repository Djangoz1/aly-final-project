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
            <div className="presentation font2">
              <h1 className="gradient-primary">
                The social freelancing platform
              </h1>

              <h2>
                Where <b className="bold">Block Chain</b> meets{" "}
                <b className="bold">Social Freelancing</b>
              </h2>

              <h3>
                Be at the heart of the revolution -{" "}
                <b className="bold">Platform name</b> is a place where every
                innovative idea <b className="bold">finds its developers</b>,
                every talent can <b className="bold">join any project</b> and be
                valued, and where investors{" "}
                <b className="bold">shape the future</b> and get involved at
                each step.
              </h3>

              <div className="cta-container">
                <CreateProfile />

                <button className="cta-button project-owner">
                  Launch my project
                </button>
              </div>
            </div>
          </MySection>
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
