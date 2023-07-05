import { Drawer } from "components/Drawer";
import { Logo } from "components/Logo";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export const Header = ({ setter, isOpen }) => {
  return (
    <div className="flex items-center bg-white w-[90%] mx-auto justify-between px-5 border border-x-0  border-black/5  py-3  h-[10vh]">
      <Logo />
      <div className="text-black flex w-[25%] justify-evenly items-center">
        <p>How it works</p>
        <p>FAQ</p>
        <Drawer setter={setter} isOpen={isOpen} />
      </div>
    </div>
  );
};
