import { Icon } from "@iconify/react";
import { icfyHANDSHAKE } from "icones";
import Link from "next/link";
import React from "react";
import { LinearGradient } from "react-text-gradients";

export const Logo = () => {
  return (
    <Link
      href={"/"}
      className="text-white text-shadow font2  text-2xl font-bold flex items-center"
    >
      <LogoIc />
      eWork
    </Link>
  );
};

export const LogoIc = ({ styles }) => {
  return (
    <Icon
      icon={icfyHANDSHAKE}
      className={`text-white rotate-[45deg] text-[30px]  ${styles || ""}`}
    />
  );
};
