import { v4 as uuidv4 } from "uuid";
import { Drawer } from "components/Drawer";
import { Logo } from "components/Logo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuthState } from "context/auth";

export const Header = ({ setter, isOpen }) => {
  const { cv } = useAuthState();

  return (
    <div className="flex items-center mb-5 w-[90%] mx-auto justify-between px-5 border border-x-0  border-black/5  pt-3  h-[8vh]">
      <Logo />

      <Drawer setter={setter} isOpen={isOpen} />
    </div>
  );
};
