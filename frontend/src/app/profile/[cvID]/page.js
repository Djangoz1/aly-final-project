"use client";
import { useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/myComponents/modal/MyModal";
import { useMissionDispatch } from "context/hub/mission";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";
import { MySideList } from "components/myComponents/MySideList";
import { MyCard } from "components/myComponents/card/MyCard";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { Pub } from "components/Pub";
import { v4 } from "uuid";
import { icfy } from "icones";

export default function Profile({ params }) {
  let user = useAuthState();

  let [isPubs, setIsPubs] = useState(null);

  let { cvID, metadatas, datas } = useCVState();
  console.log("datas", datas);
  console.log("metadatas", metadatas);
  let state = async () => {
    setIsPubs(await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]));
  };

  useEffect(() => {
    if (!isPubs || isPubs.length !== datas?.pubs) {
      state();
    }
  }, [cvID, datas?.pubs]);
  return (
    <LayoutProfile params={params}>
      <div className="w-full flex ">
        <MyCard head={{ title: "Pubs", icon: icfy.msg.chat }} styles={"w-1/3"}>
          <div className="w-full flex flex-col border-r-2 max-h-[40vh] h-[25vh]  overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
            {isPubs?.length > 0 ? (
              isPubs?.map((pubID, index) => (
                <Pub
                  id={pubID}
                  styles={{ size: "10px", clamp: 3 }}
                  key={v4()}
                  _owner={metadatas}
                />
              ))
            ) : (
              <p className="text-center text-white/40 my-auto">No pubs found</p>
            )}
          </div>
        </MyCard>
      </div>
    </LayoutProfile>
  );
}
