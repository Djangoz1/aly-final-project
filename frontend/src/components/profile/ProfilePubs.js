import { Pub } from "components/Pub";
import { ADDRESSES } from "constants/web3";
import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { useAuthState } from "context/auth";

export const ProfilePubs = ({ _state }) => {
  let [isPubs, setIsPubs] = useState(null);
  let { cv, metadatas } = useAuthState();
  let state = async () => {
    setIsPubs(
      await _apiGet("indexerOfToken", [
        _state?.cvID || cv,
        ADDRESSES["pubsHub"],
      ])
    );
  };

  useEffect(() => {
    if (!isPubs) {
      state();
    }
  }, [_state, cv]);
  return (
    <div className="w-full border-r-2 max-h-[80vh] overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
      {isPubs?.map((pubID, index) => (
        <div
          key={uuidv4()}
          className={` border border-t-0 border-b-1 border-white/10 border-x-0 py-5`}
        >
          <Pub id={pubID} _owner={_state?.metadatas || metadatas} />
        </div>
      ))}
    </div>
  );
};
