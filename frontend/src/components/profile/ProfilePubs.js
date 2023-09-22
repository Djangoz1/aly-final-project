import { Pub } from "components/Pub";
import { ADDRESSES } from "constants/web3";
import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { useAuthState } from "context/auth";
import { useCVState } from "context/hub/cv";

export const ProfilePubs = ({ _state }) => {
  let [isPubs, setIsPubs] = useState(null);

  let { cvID, metadatas } = useCVState();
  let state = async () => {
    setIsPubs(await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]));
  };

  useEffect(() => {
    if (!isPubs) {
      state();
    }
  }, [cvID]);
  return (
    <div className="w-full border-r-2 max-h-[80vh] overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
      {isPubs?.map((pubID, index) => (
        <div
          key={uuidv4()}
          className={` border border-t-0 border-b-1 border-white/10 hover:bg-black/20 hover:text-white border-x-0 py-5`}
        >
          <Pub id={pubID} _owner={metadatas} />
        </div>
      ))}
    </div>
  );
};
