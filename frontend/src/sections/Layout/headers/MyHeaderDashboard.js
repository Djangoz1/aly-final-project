import { Icon } from "@iconify/react";
import { MySub } from "components/myComponents/text/MySub";
import { icfy, icfyHOME } from "icones";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";

export const MyHeaderDashboard = ({ source, arr }) => {
  return (
    <div className="text-sm  w-full pl-1 breadcrumbs">
      <ul>
        <li
          className={
            arr?.length === 0 ? "opacity-100" : "opacity-60 hover:opacity-100"
          }
        >
          <MySub
            style={"hover:scale-[1.02] flex items-center transition gap-2"}
          >
            <Icon className="text-lg" icon={source?.icon} />
            <Link href={source?.url || "#"}>{source.title}</Link>
          </MySub>
        </li>

        {arr?.map((el, i) => (
          <li
            className={
              arr?.length === i + 1
                ? "opacity-100"
                : "opacity-60 hover:opacity-100"
            }
            key={v4()}
          >
            <MySub
              style={"hover:scale-[1.05] flex items-center transition gap-2"}
            >
              {el?.icon ? <Icon icon={el?.icon} /> : <></>}
              <Link href={el?.url || "#"}>{el?.title}</Link>
            </MySub>
          </li>
        ))}
      </ul>
    </div>
  );
};
