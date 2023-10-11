import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateMission } from "utils/ui-tools/state-tools";
import { fetchMission } from "utils/works";

export const MissionName = ({ id, metadatas, style }) => {
  let [isName, setIsName] = useState(null);
  let fetchName = async () => {
    if (metadatas) {
      setIsName(metadatas?.title);
    } else if (id != 0 && id) {
      let mission = await stateMission(id);
      setIsName(mission?.metadatas?.title);
    }
  };

  useEffect(() => {
    if (!metadatas?.title && isName === null) {
      fetchName();
      console.log("mission name fetch ...");
    }
  }, [id, metadatas]);
  return (
    <Link className={`hover:text-info ${style}`} href={`/works/mission/${id}`}>
      {metadatas?.title || isName || "No name"}
    </Link>
  );
};
