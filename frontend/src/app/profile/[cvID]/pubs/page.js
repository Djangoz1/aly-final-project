"use client";

import { useAuthState } from "context/auth";
import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { Pub } from "components/Pub";
import { useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { v4 } from "uuid";

export default function Page({ params }) {
  let { cv } = useAuthState();
  let [isPubs, setIsPubs] = useState(null);

  let { cvID, metadatas, datas } = useCVState();
  let state = async () => {
    setIsPubs(await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]));
  };

  useEffect(() => {
    if (!isPubs || isPubs.length !== datas?.pubs) {
      state();
    }
  }, [cvID, datas?.pubs]);

  return (
    <LayoutProfile params={params} path={"pubs"}>
      <div className="w-full border-r-2 max-h-[80vh]  overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
        {isPubs?.map((pubID, index) => (
          <Pub id={pubID} key={v4()} _owner={metadatas} />
        ))}
      </div>
    </LayoutProfile>
  );
}
