"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import { twMerge } from "tailwind-merge";
import { MyTitle } from "components/myComponents/text/MyTitle";
export const HeroScrollPreview = () => {
  return (
    <div className="flex flex-col">
      <HeroScroll />
    </div>
  );
};
export const HeroScroll = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="h-[120vh] flex items-center justify-center relative ">
      <div
        className="py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} />
        <Card rotate={rotate} translate={translate} scale={scale} />
      </div>
    </div>
  );
};

export const Header = ({ translate }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      <MyTitle style="text-4xl c3">
        Unleash the power of <br />{" "}
        <span className="text-6xl c4  font-bold mt-1 leading-none">
          our protocoles
        </span>
      </MyTitle>
    </motion.div>
  );
};

export const Card = ({ rotate, scale, translate }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate, // rotate in X-axis
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl mt-5 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <img
        src="./view.png"
        className="h-full border border-black rounded-lg w-full"
      />
    </motion.div>
  );
};
