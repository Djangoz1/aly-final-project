import { CVName } from "components/inputs/inputsCV/CVName";
import { TextAI } from "components/myComponents/text/TextAI";
import { Avatar } from "components/profile/ProfileAvatar";
import { useFormState } from "context/form";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
export const ChatBubble = ({
  children,
  style,

  ai,
  CID,
  name,
  text,
  footer,
  _form,
  image,
  color,
}) => {
  let { form } = _form ? useFormState() : { form: undefined };
  let [isForm, setIsForm] = useState(undefined);
  useEffect(() => {
    if (_form) {
      setIsForm();
    }
  }, []);

  return (
    !isForm?.no && (
      <div className={`chat     ${"chat-start" || style}`}>
        {!image?.no && CID !== false && (
          <Avatar
            src={ai ? "/ai.png" : image}
            CID={CID}
            avatarStyle="chat-image w-12 h-12 "
            noCircle={true}
          ></Avatar>
        )}
        <div className="chat-header">
          {ai ? "Aly" : name}
          {/* <span className="text-xs  opacity-50">Mission name</span> */}
        </div>
        <div
          className={`chat-bubble ${
            [
              "",
              "chat-bubble-success",
              "chat-bubble-error",
              "chat-bubble-secondary",
              "chat-bubble-primary",
              [],
            ][color ? color : _form ? _form(form)?.color : 0]
          } `}
        >
          {(_form && _form?.(form)?.text) ||
            (text && (
              <TextAI
                style={" text-xs"}
                text={_form ? _form(form)?.text : text}
              ></TextAI>
            ))}
          {_form ? _form(form).children : children || undefined}
        </div>
        {footer ? (
          <time className="chat-footer text-xs opacity-50">{footer}</time>
        ) : undefined}
      </div>
    )
  );
};
