import Link from "next/link";
import React from "react";

export const LaunchpadName = ({ launchpadID, metadatas }) => {
  return (
    <Link
      href={"/launchpad/" + launchpadID}
      className={"w-fit hover:text-info"}
    >
      {metadatas?.title}
    </Link>
  );
};
