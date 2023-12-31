import React from "react";

import { motion, useScroll, useSpring } from "framer-motion";

export const MyProgress = ({ style }) => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress);

  return <motion.div style={{ scaleX }} className={style} />;
};
