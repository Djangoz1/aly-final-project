import { Icon } from "@iconify/react";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { icfy, icfyHANDSHAKE } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "react-text-gradients";
import { AnimatePresence, motion } from "framer-motion";
import { v4 } from "uuid";
export const Logo = () => {
  const [pointer, setPointer] = useState(0);

  const titles = [
    <>
      <span className="text-lg my-auto ">e</span>W
      <span className="text-lg my-auto ">ork</span>
    </>,

    <>
      <span className="text-lg my-auto ">ecentralized</span>
    </>,
    <>
      <span className="text-lg my-auto ">e</span>W
      <span className="text-lg my-auto ">ork</span>
    </>,
    <>
      <span className="text-lg my-auto ">eFI</span>
    </>,
    <>
      <span className="text-lg my-auto ">e</span>W
      <span className="text-lg my-auto ">ork</span>
    </>,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Incrémentez le pointeur
      setPointer((prevPointer) => {
        if (prevPointer === titles.length - 1) {
          // Si le pointeur atteint la fin, réinitialisez-le à 0
          return 0;
        } else {
          return prevPointer + 1;
        }
      });
    }, 8000); // Changer toutes les 5 secondes

    return () => {
      clearInterval(interval); // Nettoyer l'intervalle lorsque le composant est démonté
    };
  }, [titles.length]);

  return (
    <Link
      href={"/"}
      className="c3 logo text-shadow uppercase font2  text-2xl  flex items-end font2 font-light "
    >
      <div
        className="w-12 
       border logoD leading-none  flex items-center justify-center  rounded-r-full h-[30px] font2 "
      >
        <Icon icon={icfy.ux.key} className="text-lg text-white" />
      </div>
      <AnimatePresence>
        <motion.div
          key={v4()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          {titles[pointer]}
        </motion.div>
      </AnimatePresence>
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
