import { Icon } from "@iconify/react";
import { STATUS, _STATUS } from "constants/status";
import { icfy } from "icones";
import "./style.css";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useToolsState } from "context/tools";
import { MySub } from "../text/MySub";
import { useAuthState } from "context/auth";
export const MyStatus = ({
  padding,
  status,
  target,
  style,
  children,
  setter,
  component,
  allowed,
  toStatus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state, refresh } = useToolsState();
  let { metadatas } = useAuthState();
  let handleClick = async () => {
    if (allowed && status != toStatus) {
      setIsLoading(true);

      if (setter) {
        await setter();
      } else {
        await _STATUS({
          state: state,
          metadatas: metadatas,
          to: toStatus,
          target,
        });
      }
      if (refresh) {
        console.log(refresh);
        await refresh();
      }
      setIsLoading(false);
    }
  };
  return (
    <>
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)} // Fonction à exécuter lorsque le survol commence
        onHoverEnd={() => setIsHovered(false)}
        className={` ${style || "  text-[9px]  "}
          ${
            allowed && status != toStatus
              ? `p-0 flex flex-col   overflow-hidden `
              : "uppercase"
          }
        `}
      >
        <motion.div
          className={`h-fit c3 border font-light   shadow rounded-lg flex items-center    ${
            STATUS?.[target]?.[
              status != toStatus && allowed && toStatus && isHovered
                ? toStatus
                : status
            ]?.bg
          }
 font-semibold
           ${padding || "py-1 px-2"}
         backdrop-blur
        ${allowed && status != toStatus ? " cursor-pointer" : "cursor-default"}
          `}
        >
          {!isHovered && component ? (
            component
          ) : (
            <>
              {allowed && status != toStatus ? (
                <>
                  <span
                    className={`mr-3 ${
                      isLoading && "loading loading-bars loading-xs"
                    }`}
                  >
                    {!isLoading && "👉"}
                  </span>
                </>
              ) : (
                <div
                  className={` pulse-status w-[10px] h-[10px] mr-3  ${STATUS?.[target]?.[status]?.color}`}
                ></div>
              )}

              {
                STATUS?.[target]?.[
                  status != toStatus && allowed && toStatus && isHovered
                    ? toStatus
                    : status
                ]?.status
              }
            </>
          )}
        </motion.div>
        {allowed && status != toStatus && (
          <MySub size={8} style={"c4"}>
            Click to change status
          </MySub>
        )}
      </motion.button>
    </>
  );
};
