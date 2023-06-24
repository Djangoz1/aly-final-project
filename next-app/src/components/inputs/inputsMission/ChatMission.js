import { ChatBubble } from "components/ChatBubble";
import React, { useEffect, useState } from "react";

export const ChatMission = ({ features }) => {
  const [messages, setMessages] = useState([
    { text: "Must add a description", add: false },
    { text: "Must add estimated days", add: false },
    { text: "Must pay your worker", add: false },
    { text: "Could add assigned worker", add: false },
    { text: "This feature is open for every worker !", add: false },
  ]);

  let [status, setStatus] = useState(false);
  const { description, estimatedDay, wadge, assignedWorker, inviteOnly } =
    features;

  useEffect(() => {
    const _messages = messages;
    if (description) {
      _messages[0].add = true;
      _messages[0].text = `Feature is : ${description}`;
    }
    if (estimatedDay > 0) {
      _messages[1].add = true;
      _messages[1].text = `Estimated days is : ${estimatedDay}`;
    }
    if (wadge > 0) {
      _messages[2].add = true;
      _messages[2].text = `Wadge to this feature : ${wadge}`;
    }
    if (assignedWorker) {
      _messages[3].add = true;
      _messages[3].text = `Assigned worker : ${assignedWorker}`;
    }
    if (inviteOnly) {
      _messages[4].add = true;
      _messages[4].text = `This feature is locked !`;
    }
    setMessages(_messages);
  }, [features]);

  const checkMessageStatus = () => {
    let _status = true;
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
      if (!message.add && index < messages.length - 2) {
        _status = false;
      }
    }

    setStatus(_status);
  };

  useEffect(() => {
    checkMessageStatus();
  }, [features]);

  return (
    <div className="bg-black w-[40%]">
      <div className="flex items-center justify-between">
        <button
          className={`btn w-[130px] h-[130px] btn-primary btn-circle ml-5`}
          //   disabled={"disabled"}
          disabled={!status ? "disabled" : null}
        >
          Add Feature
        </button>
        <ChatBubble messages={messages} />
      </div>
    </div>
  );
};
