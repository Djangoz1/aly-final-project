import { Drawer } from "components/Drawer";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <div className="flex justify-between px-5 py-3">
      <Link href={"/"}>
        <h1 className="text-white text-2xl font-black">Work3</h1>
      </Link>
      <div className="text-white flex w-[25%] justify-evenly items-center">
        <p>How it works</p>
        <p>FAQ</p>
        <Drawer />
      </div>
    </div>
  );
};
