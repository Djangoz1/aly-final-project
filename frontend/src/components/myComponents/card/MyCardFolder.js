import React from "react";
import { MySub } from "../text/MySub";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import Link from "next/link";
import "./style.css";
import { MyTitle } from "../text/MyTitle";
export const MyCardFolder = ({
  style,
  hoverable,
  title,
  url,
  children,
  color,
  image,
}) => {
  let colors = [
    { bg: "bgprim", color: "c3" },
    { bg: "bg-sky-950", color: "c3" },
    { bg: "bg1", color: "c3" },
    { bg: "bg-secondary", color: "c3" },

    { bg: "bg-primary", color: "c3" },
    { bg: "bg-cyan-950", color: "c3" },
    { bg: "gb3 g1", color: "c3" },
    { bg: "bg2", color: "c1" },
    { bg: "gr1 g1", color: "c3" },
  ];
  color = color >= colors.length ? color % colors.length : color;

  return (
    <div
      className={`flex flex-col  _hover hover:-translate-y-1 ${
        hoverable ? "card-folder" : undefined
      } ${style}`}
    >
      <div
        className={`h-[180px] round relative   z-1 shadow1 rounded-2xl overflow-hidden  md:w-[250px] w-[330px] ${
          colors?.[color || 0]?.bg
        } `}
      >
        <div className="h-1/2 px-3 py-8 box-border bg-gradient-to-r from-white/20 to-white/5 w-full relative ">
          <img
            src={image}
            className="absolute w-1/2  left-1/2 -translate-x-1/2 top-0"
          />
        </div>
        <div
          className={`flex  px-3 justify-between relative shadow1 text-neutral-300 hover:text-white h-1/2 ${colors?.[color]?.bg} `}
        >
          <div className={`flex flex-col`}>
            <MyTitle style={` uppercase text-xl ${colors?.[color]?.color}`}>
              {title}
            </MyTitle>
            <MySub size={"12"} style={"flex items-center "}>
              {children}
            </MySub>
          </div>
          <Link
            href={url || "#"}
            className={`btn btn-xs btn-ghost ${colors?.[color]?.color}`}
          >
            <Icon
              className=" text-lg  rotate-90"
              icon={icfy.ux.dots.horizontal}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
