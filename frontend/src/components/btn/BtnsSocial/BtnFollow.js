import React, { useEffect, useRef, useState } from "react";
import "./style.css";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthState } from "context/auth";
import { controllers } from "utils/controllers";

export const BtnFollow = ({ follow, userID, style, unfollow, refresh }) => {
  let [isFollow, setIsFollow] = useState(null);

  let { cv, metadatas } = useAuthState();

  let checkFollow = async () => {
    try {
      let follow = await controllers.get.profile.follow({
        ownerID: metadatas?.id,
        followID: userID,
      });
      setIsFollow(follow);
    } catch (error) {
      setIsFollow(false);
    }
  };

  useEffect(() => {
    if (
      isFollow === null &&
      userID !== metadatas?.id &&
      userID &&
      metadatas?.id
    )
      checkFollow();
  }, [userID, metadatas?.id]);

  let setFollow = async () => {
    if (userID != metadatas?.id) {
      await controllers.create.follow({
        followID: userID,
        ownerID: metadatas?.id,
      });
      checkFollow();
      refresh && refresh();
    }
  };
  return (
    userID !== metadatas?.id && (
      <button
        onClick={() => setFollow()}
        className={`transition-all btn btn-ghost p-2 rounded-full w-fit ${
          style && style
        } h-fit ${isFollow ? "text-error shadow2" : "c2 shadow1"}`}
      >
        {isFollow ? unfollow : follow}
      </button>
    )
  );
};
