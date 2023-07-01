import { CVName } from "components/inputs/inputsCV/CVName";
import React from "react";
import { v4 as uuid } from "uuid";
export const ChatBubble = ({ messages }) => {
  return (
    <div className=" ">
      <div className="chat chat-end">
        <div className="chat-header">
          <CVName />
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">
          {messages?.map((message, index) => (
            <span
              className={message.add ? "text-green-500" : "text-red-500"}
              key={uuid()}
            >
              {message.text}
              <br />
            </span>
          ))}
        </div>
        <div className="chat-footer opacity-50">Feature # </div>
      </div>
    </div>
  );
};
