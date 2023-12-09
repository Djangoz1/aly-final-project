import { useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const MyScrolledXDiv = ({ children, style }) => {
  if (!children) return null;
  const scrollContainer = useRef(null);
  let direction = 1; // 1 pour défiler vers la droite, -1 pour défiler vers la gauche
  let refChild = useRef(null);
  let isInView = useInView(scrollContainer);
  useEffect(() => {
    if (isInView) {
      const maxScrollLeft =
        scrollContainer.current?.scrollWidth -
        scrollContainer.current?.clientWidth;

      const scroll = () => {
        if (!scrollContainer.current?.scrollLeft) {
          return;
        }
        const scrollLeft = scrollContainer.current?.scrollLeft;

        // Inversion de la direction si nécessaire
        if (scrollLeft >= maxScrollLeft || scrollLeft <= 0) {
          direction *= -1;
        }

        const newScrollLeft = scrollLeft + direction * 0.5; // Ralentissement du défilement
        scrollContainer.current.scrollLeft = newScrollLeft;

        requestAnimationFrame(scroll);
      };

      requestAnimationFrame(scroll);
    }
  }, [isInView]);
  return (
    children && (
      <div
        ref={scrollContainer}
        className={` overflow-x-scroll w-full  flex ${style || ""}`}
      >
        {children}
      </div>
    )
  );
};
