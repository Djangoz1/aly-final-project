import { ImagePin } from "components/Image/ImagePin";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ADDRESSES } from "constants/web3";
import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const ProfileAvatar = ({
  cvID,
  onlyAvatar,
  component,
  metadatas,
  style,
}) => {
  const [isMetadatas, setIsMetadatas] = useState(null);
  let state = async () => {
    if (metadatas) {
      setIsMetadatas(metadatas);
      return;
    }
    if (cvID && cvID > 0) {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let _metadatas = await fetchJSONByCID({ id: uri, table: "accounts" });
      setIsMetadatas(_metadatas);
    }
  };
  useEffect(() => {
    if (!isMetadatas) state();
  }, [cvID]);

  return onlyAvatar ? (
    <>
      <Avatar style={style} metadatas={isMetadatas} CID={isMetadatas?.image} />
    </>
  ) : (
    <div className="flex items-end">
      <div className="avatar h-fit">
        <Avatar
          style={style}
          metadatas={isMetadatas}
          CID={isMetadatas?.image}
        />
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

export const Avatar = ({
  CID,
  metadatas,
  src,
  noCircle,
  avatarStyle,
  style,
}) => {
  return metadatas && !CID ? (
    <div className="avatar placeholder">
      <div
        className={"bg-neutral-focus text-neutral-content rounded-full w-16"}
      >
        <span className="text-xl">{metadatas?.username[0]}</span>
      </div>
    </div>
  ) : (
    <div className={`avatar ${avatarStyle || undefined}`}>
      <ImagePin
        style={`rounded-full ${
          !noCircle
            ? "ring ring-primary ring-offset-base-100 ring-offset-2"
            : null
        } ${style || "w-16"}`}
        CID={CID}
        defaultImage={src || "/defaultprofile.png"}
      />
    </div>
  );
};
