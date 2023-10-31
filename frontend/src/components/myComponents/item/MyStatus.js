import { Icon } from "@iconify/react";
import { STATUS, _STATUS } from "constants/status";
import { icfy } from "icones";
import "./style.css";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useToolsState } from "context/tools";
export const MyStatus = ({
  padding,
  status,
  target,
  refresh,
  style,
  children,
  setter,
  component,
  allowed,
  toStatus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useToolsState();

  let handleClick = async () => {
    console.log(toStatus);
    if (allowed && status != toStatus) {
      setIsLoading(true);
      console.log("refdsfsssre", refresh);
      if (setter) {
        await setter();
      } else {
        await _STATUS({ state: state, to: toStatus, target });
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
        className={` ${style || "  text-xs  "}
          ${
            allowed && status != toStatus
              ? `w-fit  g1 ${["gb1", "gr1"]?.[status]} rounded-lg  text-warning`
              : ""
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
uppercase font-semibold
           ${padding || "py-2 px-5"}
         backdrop-blur
        ${
          allowed && status != toStatus
            ? "hover:bg-zinc-900 cursor-pointer"
            : "cursor-default"
        }
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
      </motion.button>
    </>
  );
};
