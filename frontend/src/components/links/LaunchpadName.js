import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateLaunchpad } from "utils/ui-tools/state-tools";

export const LaunchpadName = ({ url, launchpadID, metadatas, style }) => {
  let [isMetadatas, setIsMetadatas] = useState(null);
  useEffect(() => {
    if (!isMetadatas && !metadatas) {
      (async () => {
        let launchpad = await stateLaunchpad(launchpadID);

        setIsMetadatas(launchpad?.metadatas);
      })();
    }
  }, [launchpadID]);
  return (
    <Link
      href={url === false ? "#" : "/launchpad/" + launchpadID}
      className={`w-fit ${url === false ? "" : "hover:text-info"} ${
        style || ""
      }`}
    >
      {metadatas?.title || isMetadatas?.title || "No name"}
    </Link>
  );
};
