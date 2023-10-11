import React from "react";

import { useAnimation, useViewportScroll, motion } from "framer-motion";

export const MyProgress = ({ style }) => {
  const controls = useAnimation();
  const { scrollYProgress } = useViewportScroll();

  const updateScaleX = () => {
    controls.start({
      scaleX: scrollYProgress.current,
      transition: {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      },
    });
  };

  scrollYProgress.onChange(() => {
    updateScaleX();
  });
  return <motion.div className={style} animate={controls} />;
};
