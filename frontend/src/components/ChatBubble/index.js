import { CVName } from "components/inputs/inputsCV/CVName";
import { TextAI } from "components/myComponents/text/TextAI";
import { Avatar } from "components/profile/ProfileAvatar";
import React from "react";
import { v4 as uuid } from "uuid";
export const ChatBubble = ({
  children,
  style,
  ai,
  CID,
  name,
  text,
  footer,
  image,
}) => {
  return (
    <div className={"chat  chat-start " + style}>
      <Avatar
        src={ai ? "/ai.png" : image}
        CID={CID}
        avatarStyle="chat-image w-12 h-12 "
        noCircle={true}
      ></Avatar>
      <div className="chat-header">
        {ai ? "Aly" : name}
        {/* <span className="text-xs  opacity-50">Mission name</span> */}
      </div>
      <div className="chat-bubble">
        <TextAI style={" text-xs"} text={text}></TextAI>
        {children || undefined}
      </div>
    </div>
  );
};
