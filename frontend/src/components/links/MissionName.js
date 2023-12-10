import { ADDRESSES } from "constants/web3";
import { useInView } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { controllers } from "utils/controllers";
import { clientPocket } from "utils/ui-tools/pinata-tools";
import { stateMission } from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchMission } from "utils/works";

export const MissionName = ({ id, missionHash, metadatas, style }) => {
  let [isName, setIsName] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref);
  let fetchName = async () => {
    let uri =
      missionHash ||
      (await _apiGet("tokenURIOf", [id, ADDRESSES["missionsHub"]]));
    try {
      if (uri) {
        let record = await clientPocket.records.getOne("missions", uri);
        setIsName(record.title);
      }
    } catch (error) {
      console.error("error missionName", { error });
    }
  };

  useEffect(() => {
    if (
      !metadatas?.title &&
      (id > 0 || missionHash) &&
      isInView &&
      isName === null
    ) {
      fetchName();
      console.log("mission name fetch ...");
    }
  }, [id, isInView]);
  return missionHash ? (
    <span className={style} ref={ref}>
      {isName}
    </span>
  ) : (
    <Link
      ref={ref}
      className={`hover:text-info ${style}`}
      href={`/mission/${id}`}
    >
      {metadatas?.title || isName || "No name"}
    </Link>
  );
};
