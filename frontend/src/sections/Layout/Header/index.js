import { v4 as uuidv4 } from "uuid";
import { Drawer } from "components/Drawer";
import { Logo } from "components/Logo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuthState } from "context/auth";

export const Header = ({ setter, isOpen }) => {
  const { cv } = useAuthState();
  let currentPath = window.location.pathname;

  useEffect(() => {
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      if (currentPath === route?.path) {
        setIsClicked(route);
        return;
      }
    }
  }, [currentPath, cv]);
  const routes = [
    { name: "Home", path: "/" },
    { name: "Profile", path: cv ? `/profile/cv/${cv}` : "/" },
    { name: "Community", path: `/community` },
    { name: "How it works", path: "/" },
    { name: "FAQ", path: "/" },
  ];
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div className="flex items-center mb-5 w-[90%] mx-auto justify-between px-5 border border-x-0  border-black/5  pt-3  h-[8vh]">
      <Logo />

      <div className="text-white  flex   h-full mx-auto  items-center">
        {routes.map((route) => (
          <Link
            href={route.path}
            className={`flex flex-col font-bold justify-center px-5 h-full  border-x-0 border-t-0 ${
              isClicked?.name === route?.name &&
              "border-b-[3px] border border-primary"
            }`}
            key={uuidv4()}
            onClick={() => setIsClicked(route)}
          >
            {route?.name}
          </Link>
        ))}
      </div>
      <Drawer setter={setter} isOpen={isOpen} />
    </div>
  );
};
