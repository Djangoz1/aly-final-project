"use client";
import { useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/myComponents/modal/MyModal";
import { useMissionDispatch } from "context/hub/mission";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect } from "react";
import { MySideList } from "components/myComponents/MySideList";

export default function Profile({ params }) {
  let user = useAuthState();
  let { metadatas } = useCVState();
  return (
    <LayoutProfile params={params}>
      <div className="w-full flex ">
        <MyModal
          btn={
            <ImagePin
              style={" w-[30vw]"}
              CID={metadatas?.attributes?.[0]?.cvImg}
            />
          }
          styles={{ btn: "btn-ghost h-fit mx-auto my-auto " }}
          modal={
            <ImagePin
              style={" w-[80vw]"}
              CID={metadatas?.attributes?.[0]?.cvImg}
            />
          }
        />
      </div>
      <MySideList />
    </LayoutProfile>
  );
}
