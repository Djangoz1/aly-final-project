import React from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { v4 } from "uuid";
import { MyCard } from "../card/MyCard";
import { Icon } from "@iconify/react";
import { icfy } from "icones";

export const MyFramerModal = ({
  arr,
  selectedId,
  style,

  setSelectedId,
  children,
}) => {
  return (
    <>
      {arr.map((el, index) => (
        <motion.div
          ref={index === arr?.length - 1 ? undefined : undefined}
          layoutId={"modal#" + index}
          key={v4()}
          onClick={() => setSelectedId(index)}
        >
          <MyCard template={1} styles={style + " cursor-pointer"}>
            {el}
          </MyCard>
        </motion.div>
      ))}
      <AnimatePresence>
        {selectedId >= 0 && selectedId != null && (
          <motion.div
            className="z-100  absolute top-0 left-0  box-border  w-full h-full"
            layoutId={"modal#" + selectedId}
          >
            <MyCard
              template={3}
              styles=" flex flex-col h-full relative w-full z-100 bg-white c1  p-3"
            >
              <motion.button
                className="btn btn-ghost btn-xs absolute opacity-70 hover:opacity-100  transition top-2 right-2"
                onClick={() => setSelectedId(null)}
              >
                <Icon
                  className="hover:scale-125 text-lg transition hover:text-xl"
                  icon={icfy.ux.check.uncheck}
                />
              </motion.button>

              {children}
            </MyCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
