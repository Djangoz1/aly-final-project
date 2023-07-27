import Link from "next/link";
import React from "react";
import { LinearGradient } from "react-text-gradients";

export const Logo = () => {
  return (
    <Link href={"/"} className="text-white text-shadow  text-2xl font-black">
      <LinearGradient gradient={["to left", "red , cyan"]}>
        Wwwork3
      </LinearGradient>
    </Link>
  );
};
