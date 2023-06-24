import { InputAssignedWorker } from "components/inputs/inputsMission/AssignedWorker";
import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { InputDescription } from "components/inputs/inputsMission/Description";
import { InputEstimatedDay } from "components/inputs/inputsMission/EstimatedDay";
import { InputInviteOnly } from "components/inputs/inputsMission/InviteOnly";
import { InputWadge } from "components/inputs/inputsMission/Wadge";
import React, { useState } from "react";

export const CreationFeatures = () => {
  let [features, setFeatures] = useState({
    description: "",
    estimatedDay: 0,
    wadge: 0,
    inviteOnly: false,
    assignedWorker: "",
  });
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <InputDescription features={features} setFeatures={setFeatures} />
        <InputEstimatedDay features={features} setFeatures={setFeatures} />
        <InputWadge features={features} setFeatures={setFeatures} />
        <InputAssignedWorker features={features} setFeatures={setFeatures} />
        <InputInviteOnly features={features} setFeatures={setFeatures} />
      </div>
      <ChatMission features={features} />
    </div>
  );
};
