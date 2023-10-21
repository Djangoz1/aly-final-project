import Link from "next/link";
import React from "react";
import { v4 } from "uuid";
import "./style.css";
export const MyFunMenus = ({ children, bottom, top, menus, style }) => {
  let colors = [
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
    "my_m_color1",
  ];
  let _menus = menus.slice().reverse();

  return (
    <>
      <div className={`fun_menus  shadow1   ${style}`}>
        <div className="background"></div>
        {bottom && (
          <div className="bottom  absolute bottom-0 left-0 w-full">
            {bottom}
          </div>
        )}
        <div className="flex boxes h-full w-full flex-col">
          {menus?.map((el, i) => (
            <Link key={v4()} href={el?.url || "#"}>
              <div
                className={`absolute shadow1 box${i + 1} z-${
                  i + 1
                } bottom-0 left-0 box ${colors[el?.color]}
               
               `}
                style={{
                  width: el?.width,
                  height: el?.height,
                }}
              >
                <div className="ml-auto flex justify-end z-100 text-2xl relative">
                  {el?.component}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="logo">{children}</div>
        {top && (
          <div className="top absolute top-0 -right-2 pr-5 shadow1 bg-zinc-950/70 rounded-full p-2 w-fit">
            {top}
          </div>
        )}
      </div>
    </>
  );
};
