import { useInView, motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export const TextAI = ({ text, style, children }) => {
  const textArray = text.split("");
  let ref = useRef(null);
  let isInView = useInView(ref);
  return (
    <div>
      <AnimatePresence>
        {textArray.map((char, index) => (
          <motion.span
            ref={index === textArray.length - 1 ? ref : undefined}
            className={style}
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.05, delay: index * 0.06 }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
      {isInView && children}
    </div>
  );
};
