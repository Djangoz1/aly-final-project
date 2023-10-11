import { ImagePin } from "components/Image/ImagePin";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ADDRESSES } from "constants/web3";
import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const ProfileAvatar = ({ cvID, component, metadatas }) => {
  const [isMetadatas, setIsMetadatas] = useState(null);
  let state = async () => {
    if (metadatas) {
      setIsMetadatas(metadatas);
      return;
    }
    if (cvID && cvID > 0) {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let _metadatas = await fetchJSONByCID(uri);
      setIsMetadatas(_metadatas);
    }
  };
  useEffect(() => {
    if (!isMetadatas) state();
  }, [cvID]);

  return (
    <div className="flex items-end">
      <div className="avatar h-fit">
        <Avatar CID={isMetadatas?.image} />
      </div>
      <div className=" ml-3">
        <CVName metadata={isMetadatas} styles={"text-xs"} />
        <br />
        <span className="font-light text-xs">CV #{cvID}</span>
        {component}
      </div>
    </div>
  );
};

export const Avatar = ({ CID, style }) => {
  return (
    <ImagePin
      style={`mask mask-squircle border-zinc-800 border border-3 ${
        style || "w-16"
      }`}
      CID={CID}
    />
  );
};
