import Link from "next/link";
import React from "react";

export const FeatureName = ({ missionID, metadatas, style }) => {
  return (
    <Link
      className={`hover:text-info w-fit ${style || ""}`}
      href={`/mission/${missionID}`}
    >
      {metadatas?.title}
    </Link>
  );
};
