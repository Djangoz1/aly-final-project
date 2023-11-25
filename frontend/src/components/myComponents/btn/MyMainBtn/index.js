import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { useFormState } from "context/form";
import { useToolsState } from "context/tools";
export const MyMainBtn = ({
  children,
  template,
  form,
  setter,
  padding,
  url,
  color,
  rotate,
  disabled,
  icon,
  style,
}) => {
  let [isLoading, setIsLoading] = useState(null);
  let formState = form ? useFormState() : undefined;

  let { pointer, refresh } = useToolsState();
  let router = useRouter();

  let handleClick = async () => {
    if (setter) {
      setIsLoading(true);
      if (form) {
        await setter(formState?.form);
      } else {
        await setter();
      }
      setIsLoading(false);
      if (refresh) {
        refresh();
      }
    }
  };
  return (
    <Link
      href={url || "#"}
      onClick={handleClick}
      disabled={disabled}
      className={`${
        style || (template != 1 && "c3")
      } w-fit flex   flex-row items-center     transition  ${
        [
          "font-semibold  hover:[box-shadow:rgb(171,_196,_245)_0px_0px] max-w-full grid-cols-2 bg1 shadowh _hover px-8 py-2 [box-shadow:rgb(171,_196,_245)_-8px_8px] ",
          `font-semibold ${
            [
              "text-white hover:text-black bg-gradient-to-r hover:from-white/10 hover:to-white   from-black to-transparent border-white/40",
              "text-black hover:text-white   bg-gradient-to-bl from-white to-transparent  border-zinc-800/40 hover:bg-gradient-to-l hover:from-black/10 hover:to-black",
              "text-black bg-lime-400     border-black  hover:bg-white",
              "text-white bg-error hover:text-black     border-black  hover:bg-white",
            ]?.[color || 0]
          }    ${
            padding || "px-5"
          }  h-fit  border-x-1 border-y-1 btn btn-circle`,
          `super-btn h-fit font-light  ${padding || "px-4  py-3"}`,
        ]?.[template || 0]
      } `}
    >
      {isLoading ? (
        <span className="loading  loading-bars mx-10 loading-xs"></span>
      ) : (
        <>
          {children ? (
            <p
              className={` ${
                [
                  `${!icon?.no && "mr-6"} btn btn-ghost uppercase`,
                  " ",
                  `${!icon?.no && "mr-2"} `,
                ]?.[template || 0]
              }   `}
            >
              {children}
            </p>
          ) : undefined}
        </>
      )}
      {!icon?.no && icon !== false && (
        <Icon
          icon={icon || icfy.ux.arrow}
          className={` flex-none transition-all ${
            icon
              ? undefined
              : !isLoading && !rotate
              ? " rotate-90"
              : "-rotate-90"
          }`}
        />
      )}
    </Link>
  );
};

export const MyMainBtn1 = ({
  children,
  setter,
  color,
  url,
  disabled,
  style,
}) => {
  let _color = {
    error: "error",
    success: "success",
  };
  return (
    <button
      className={`btn-white  overflow-hidden  rounded-lg text-xs uppercase px-3 py-2  ${_color?.[color]} ${style}`}
      disabled={disabled}
      onClick={setter}
      href={url || "#"}
    >
      {children}
      <span className="b1"></span>
      <span className="b2"></span>
      <span className="b3"></span>
      <span className="b4"></span>
    </button>
  );
};
