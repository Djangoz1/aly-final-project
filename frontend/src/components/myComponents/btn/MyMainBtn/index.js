import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { useRouter } from "next/navigation";
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
    <button
      onClick={handleClick}
      disabled={disabled}
      className={"main-btn  " + style}
    >
      <Link className="py-2 shadow1" href={url || "#"}>
        {isLoading ? (
          <span className="loading  loading-bars mx-10 loading-xs"></span>
        ) : (
          <span className="px-3">{children}</span>
        )}
      </Link>
    </button>
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
