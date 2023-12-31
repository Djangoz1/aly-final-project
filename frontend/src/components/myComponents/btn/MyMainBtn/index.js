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
  _refresh,
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
      if (refresh && _refresh !== false) {
        refresh();
      }
    }
  };
  return (
    <Link
      href={url || "#"}
      onClick={handleClick}
      disabled={disabled}
      className={`${style} w-fit flex gap-2   items-center     transition  ${
        [
          `btn   ${
            [
              "bg-white border-black border-3 text-black  hover:bg-white/90 ",
              "btn-ghost",
              "bg-white/5 hover:bg-black backdrop-blur  text-white",
              "btn-error font-bold text-white",
              "btn-success font-bold ",
              "bg-gradient-to-br from-black to-zinc-900 ",
            ]?.[color || 0]
          }`,
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
        <>{children ? children : <></>}</>
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
