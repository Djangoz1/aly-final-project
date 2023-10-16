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
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { Scene } from "spline/Scene";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import { Particle } from "components/myComponents/MyParticles";
import Link from "next/link";

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

  // particlesJS("particles-js", {
  //   particles: {
  //     number: { value: 80, density: { enable: false, value_area: 800 } },
  //     color: { value: "#ffffff" },
  //     shape: {
  //       type: "circle",
  //       stroke: { width: 0, color: "#000000" },
  //       polygon: { nb_sides: 5 },
  //       image: { src: "img/github.svg", width: 100, height: 100 },
  //     },
  //     opacity: {
  //       value: 0.5,
  //       random: false,
  //       anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
  //     },
  //     size: {
  //       value: 3,
  //       random: true,
  //       anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
  //     },
  //     line_linked: {
  //       enable: true,
  //       distance: 150,
  //       color: "#ffffff",
  //       opacity: 0.4,
  //       width: 1,
  //     },
  //     move: {
  //       enable: true,
  //       speed: 6,
  //       direction: "none",
  //       random: false,
  //       straight: false,
  //       out_mode: "out",
  //       bounce: false,
  //       attract: { enable: false, rotateX: 600, rotateY: 1200 },
  //     },
  //   },
  //   interactivity: {
  //     detect_on: "canvas",
  //     events: {
  //       onhover: { enable: true, mode: "repulse" },
  //       onclick: { enable: true, mode: "push" },
  //       resize: true,
  //     },
  //     modes: {
  //       grab: { distance: 400, line_linked: { opacity: 1 } },
  //       bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
  //       repulse: { distance: 200, duration: 0.4 },
  //       push: { particles_nb: 4 },
  //       remove: { particles_nb: 2 },
  //     },
  //   },
  //   retina_detect: true,
  // });
  // var count_particles, stats, update;
  // stats = new Stats();
  // stats.setMode(0);
  // stats.domElement.style.position = "absolute";
  // stats.domElement.style.left = "0px";
  // stats.domElement.style.top = "0px";
  // document.body.appendChild(stats.domElement);
  // count_particles = document.querySelector(".js-count-particles");
  // update = function () {
  //   stats.begin();
  //   stats.end();
  //   if (
  //     window.pJSDom[0].pJS.particles &&
  //     window.pJSDom[0].pJS.particles.array
  //   ) {
  //     count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  //   }
  //   requestAnimationFrame(update);
  // };
  // requestAnimationFrame(update);

  return (
    <>
      {/* <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div> */}

      <MyLayoutApp>
        <>
          <Particle style={"fixed z-0"} />

          <Viewport full={true} id={"hero"} index={0}>
            <div className="w-full h-full items-end relative  flex">
              <div className="w-full flex flex-col   justify-end  ">
                <LinearGradient
                  className="w-fit text-xs font2 uppercase"
                  gradient={[
                    "to right",
                    "rgba(201,78,21,0.92), rgba(201,21,103,1)",
                  ]}
                >
                  Boost your startups from scratch
                </LinearGradient>
                <div className={"w-full " + styles.hero}>
                  Where
                  <br />
                  <Hg>Blockchain</Hg>
                  <br />
                  meets Social
                  <br />
                  <Hg>Freelancing</Hg>
                </div>
                <p className="w-1/3 text-white/40 text-justify text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                  autem iste fugiat atque rerum error in sequi harum. Magni
                  velit praesentium doloremque libero aspernatur dolores eos
                  temporibus voluptatibus, officia molestiae!
                </p>
              </div>

              {/* <img
                src="/hero.jpeg"
                className="h-fit w-[600px]  mask mask-hexagon rounded-lg"
              /> */}
            </div>
          </Viewport>
          {/* <Particle style={"absolute top-0 left-0 z-100"} /> */}

          <Viewport full={true} id={"presentation1"} index={1}>
            <div
              className="presentation   my-auto flex flex-col justify-center "
              id="freelance-presentation"
            >
              <h2 className={`text-center font-light text-[34px]`}>
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
          </Viewport>
          <Viewport full={true} id={"presentation2"} index={2}>
            <div className="  font2">
              <h6 className={` font-light  text-[45px]  `}>Our Services</h6>
              <p className="text-white/40 w-1/3 text-xs mb-[6vh]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
                fugiat aperiam similique voluptatum illo exercitationem
                explicabo distinctio sint ratione, recusandae voluptates officia
                natus adipisci ab soluta in unde dolor earum!
              </p>

              <div className="flex justify-evenly">
                <MyCardInfo
                  styles={"w-[23%]"}
                  color={1}
                  header={{
                    icon: icfy.work.casual,
                    title: "Freelance Protocole",
                  }}
                  btn={{
                    component: (
                      <Link
                        className="btn ml-auto btn-xs btn-outline"
                        href={"/create/mission"}
                      >
                        Create Mission
                      </Link>
                    ),
                  }}
                />
                <MyCardInfo
                  styles={"w-[23%]"}
                  color={2}
                  header={{
                    icon: icfy.court.hammer,
                    title: "Escrow Protocole",
                  }}
                />
                <MyCardInfo
                  styles={" w-[23%]"}
                  color={1}
                  btn={{
                    component: (
                      <Link
                        className="btn ml-auto btn-xs btn-outline"
                        href={"/create/profile"}
                      >
                        Create Profile
                      </Link>
                    ),
                  }}
                  header={{
                    icon: icfy.msg.chat,
                    title: "Social Protocole",
                  }}
                />
                <MyCardInfo
                  styles={"w-[23%]"}
                  color={2}
                  header={{
                    icon: icfyROCKET,
                    title: "Launchpad Protocole",
                  }}
                  btn={{
                    component: (
                      <Link
                        className="btn ml-auto btn-xs btn-outline"
                        href={"/create/launchpad"}
                      >
                        Create Launchpad
                      </Link>
                    ),
                  }}
                />
              </div>
            </div>
          </Viewport>

          <Viewport full={true} id={"presentation3"} index={3}>
            <div
              className="presentation  my-[10vh] "
              id="project-owner-presentation"
            >
              <h2 className={`text-center font-light text-[34px]`}>
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
          </Viewport>

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
      </MyLayoutApp>
    </>
  );
}
