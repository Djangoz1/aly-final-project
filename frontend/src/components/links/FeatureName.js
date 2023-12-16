import { ADDRESSES } from "constants/web3";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { clientPocket } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const FeatureName = ({ missionID, featureID, metadatas, style }) => {
  let [isMetadatas, setIsMetadatas] = useState(null);
  useEffect(() => {
    if (!metadatas && !isMetadatas && featureID) {
      (async () => {
        let uri = await _apiGet("tokenURIOf", [
          featureID,
          ADDRESSES["featuresHub"],
        ]);
        setIsMetadatas(await clientPocket.records.getOne("features", uri));
      })();
    }
  }, [featureID]);
  return (
    <Link
      className={`${missionID ? "hover:text-info" : ""} w-fit ${style || ""}`}
      href={missionID ? `/mission/${missionID}` : "#"}
    >
      {metadatas?.title || isMetadatas?.title || "No name"}
    </Link>
  );
};
