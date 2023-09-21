"use client";
import { useAuthState } from "context/auth";

import { ProfileMissions } from "../../components/profile/ProfileMissions";
import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/modal/MyModal";

export default function Profile() {
  let { cv, metadatas } = useAuthState();

  console.log(metadatas);

  return (
    <LayoutProfile>
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
      <ProfileMissions />
    </LayoutProfile>
  );
}
