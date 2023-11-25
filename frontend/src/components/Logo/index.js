import { Icon } from "@iconify/react";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { icfy, icfyHANDSHAKE } from "icones";
import Link from "next/link";

import "./style.css";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "react-text-gradients";
import { AnimatePresence, motion } from "framer-motion";
import { v4 } from "uuid";
export const Logo = ({ style, style1, styleD }) => {
  const [pointer, setPointer] = useState(0);

  return (
    <Link
      href={"/"}
      className="c3 logo text-shadow uppercase font2  text-2xl  flex items-end font2 font-light "
    >
      {/* <AnimatePresence> */}
      <motion.div
        key={v4()}
        // initial={{ scale: 0.8, opacity: 0 }}
        // animate={{ scale: 1, opacity: 1 }}
        // transition={{ duration: 0.5 }}
        className="flex  items-center"
      >
        {/* <img src="/logo.png" className="w-12 h-12" /> */}
        <div
          className={`${styleD || "w-12 text-lg h-[30px]"} 
       border logoD leading-none  flex items-center justify-center  rounded-r-full  font2 `}
        >
          <Icon icon={icfy.ux.key} className=" text-[5px] text-white" />
        </div>
        <div className={`flex items-center ${style1}`}>
          <span className={`${style || "text-lg"} my-auto `}>e</span>W
          <span className={`${style || "text-lg"} my-auto `}>ork</span>
        </div>
        {/* {titles[pointer]} */}
      </motion.div>
      {/* </AnimatePresence> */}
    </Link>
  );
};

export const LogoIc = ({ styles }) => {
  return (
    <Icon
      icon={icfyHANDSHAKE}
      className={` c3 rotate-[45deg]   ${styles || "text-[30px]"}`}
    />
  );
};
