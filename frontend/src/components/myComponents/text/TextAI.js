import { useInView, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export const TextAI = ({ text, style, size, children }) => {
  const textArray = text?.length > 0 && text.split("");
  let ref = useRef(null);
  let isInView = useInView(ref);
  let [isDone, setIsDone] = useState(null);
  useEffect(() => {
    if (isInView) {
      setIsDone(true);
    }
  }, [isInView]);
  return (
    <div className={`flex flex-col   ${style}`}>
      <div className="h-fit leading-0">
        <AnimatePresence>
          {text ? (
            textArray?.map((char, index) => (
              <motion.span
                ref={index === textArray.length - 1 ? ref : undefined}
                // className={style}
                key={index}
                className={` font3 ${
                  size ? `text-[${size}px]` : "text-3xl"
                }  font-light`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.05, delay: index * 0.02 }}
              >
                {char}
              </motion.span>
            ))
          ) : (
            <div className="loading loading-ball" />
          )}
        </AnimatePresence>
      </div>
      {isDone && children}
    </div>
  );
};
