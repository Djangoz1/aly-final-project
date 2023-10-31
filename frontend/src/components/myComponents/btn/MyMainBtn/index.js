import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
export const MyMainBtn = ({ children, setter, url, disabled, style }) => {
  let [isLoading, setIsLoading] = useState(null);

  let router = useRouter();
  let handleClick = async () => {
    if (setter) {
      setIsLoading(true);
      await setter();
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <Link
      href={url || "#"}
      onClick={handleClick}
      disabled={disabled}
      className={`${style} w-fit flex  max-w-full grid-cols-2 flex-row items-center  shadowh _hover px-8 py-2 font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px] bg1`}
    >
      {isLoading ? (
        <span className="loading  loading-bars mx-10 loading-xs"></span>
      ) : (
        <>
          <p className="mr-6 font-bold btn btn-ghost uppercase">{children}</p>
        </>
      )}
      <Icon
        icon={icfy.ux.arrow}
        className={`h-4 w-4 flex-none transition-all ${
          !isLoading ? " rotate-90" : "-rotate-90"
        }`}
      />
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
