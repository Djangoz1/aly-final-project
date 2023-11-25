import React, { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { v4 } from "uuid";
import { MyCard } from "../card/MyCard";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MyOverlay } from "../MyOverlay";

export const MyModal = ({
  btn,

  style,
  id,

  children,
}) => {
  let [isSelected, setIsSeleted] = useState(false);

  return (
    <>
      <motion.div
        layoutId={"modal#" + id}
        className="relative"
        onClick={() => setIsSeleted(!isSelected)}
      >
        {btn}
      </motion.div>
      <AnimatePresence>
        {isSelected && (
          <>
            <motion.div className={`z-100 ${style}`} layoutId={"modal#" + id}>
              <div className="relative h-full w-full">
                {children}
                <motion.button
                  className="btn  btn-ghost btn-xs absolute opacity-70 hover:opacity-100  transition top-2 right-2"
                  onClick={() => setIsSeleted(false)}
                >
                  <Icon
                    className="hover:scale-125 text-lg transition hover:text-xl"
                    icon={icfy.ux.check.uncheck}
                  />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
