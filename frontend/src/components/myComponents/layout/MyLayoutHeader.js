import { useToolsState } from "context/tools";
import React from "react";
import { Avatar } from "../../profile/ProfileAvatar";
import { CVName } from "components/links/CVName";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { Icon } from "@iconify/react";
import { MySub } from "components/myComponents/text/MySub";
import { MyCard } from "components/myComponents/card/MyCard";
import { ENUMS } from "constants/enums";
import { ImagePin } from "components/Image/ImagePin";

export const MyLayoutHeader = ({
  metadatas,
  cvID,
  bio,
  username,
  image,
  banniere,
  children,

  statusObj,
  target,
  allowed,
  style,
}) => {
  let { refresh } = useToolsState();
  return (
    <MyCard
      styles={`w-full  flex bg-gradient-to-r  from-white/5  box-border  to-transparent relative  flex-col ${style}`}
    >
      {banniere ? (
        <ImagePin
          metadatas={metadatas}
          CID={banniere}
          style={"w-full h-full absolute -z-1"}
        />
      ) : (
        <></>
      )}
      <div className="w-full pt-3 px-4 pb-10 h-full relative z-1 _hover hover:backdrop-blur-lg backdrop-blur-none">
        <div className="flex w-fit h-fit backdrop-blur relative z-1 mt-4 items-center">
          <Avatar metadatas={metadatas} CID={image || metadatas?.avatar} />

          <div className="flex ml-3 font-light c4 flex-col">
            <CVName
              cvID={cvID}
              metadata={{ username: username }}
              styles={"text-lg c3"}
            />
            <p className="mb-0 text-xs">{bio || metadatas?.description}</p>
            <p className="font-light  text-xs">
              Créer le
              <span className="ml-2 font-semibold">{metadatas?.created}</span>
            </p>
          </div>
        </div>
        {target && statusObj ? (
          <MyStatus
            allowed={allowed}
            refresh={refresh}
            status={statusObj?.current}
            toStatus={statusObj?.to}
            padding={"px-2 py-1 "}
            style={"text-xs   mt-3 w-fit mb-2 h-fit rounded   font-bold "}
            target={target}
          ></MyStatus>
        ) : (
          <></>
        )}
        {children || <></>}
      </div>
    </MyCard>
  );
};
