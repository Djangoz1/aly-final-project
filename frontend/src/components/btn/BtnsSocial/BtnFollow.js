import React, { useEffect, useRef, useState } from "react";
import "./style.css";

import { useToolsState } from "context/tools";

import { useAccount } from "wagmi";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthState } from "context/auth";

export const BtnFollow = ({ follow, style, unfollow, refresh, cvID }) => {
  let { state, pointer } = useToolsState();
  let [isFollow, setIsFollow] = useState(null);

  let { isConnected } = useAccount();
  let { cv } = useAuthState();

  let checkFollow = async () => {
    setIsFollow(await _apiGet("isFollow", [cv, cvID]));
  };
  useEffect(() => {
    if (cvID > 0 && cv > 0 && cv != cvID) checkFollow();
  }, [cvID, cv]);

  let setFollow = async (followFunc) => {
    if (cv != cvID) {
      await _apiPost(followFunc, [cvID]);

      checkFollow();

      refresh && refresh();
    }
  };
  return (
    cv !== cvID && (
      <button
        onClick={() => setFollow(isFollow ? "unfollowCV" : "followCV")}
        className={`transition-all btn btn-ghost p-2 rounded-full w-fit ${
          style && style
        } h-fit ${isFollow ? "text-error shadow2" : "c2 shadow1"}`}
      >
        {isFollow ? unfollow : follow}
      </button>
    )
  );
};
