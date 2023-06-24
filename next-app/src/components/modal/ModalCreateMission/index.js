"use client";
import { ChatBubble } from "components/ChatBubble";
import { CVName } from "components/inputs/inputsCV/CVName";
import { InputAssignedWorker } from "components/inputs/inputsMission/AssignedWorker";
import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { InputDescription } from "components/inputs/inputsMission/Description";
import { InputEstimatedDay } from "components/inputs/inputsMission/EstimatedDay";
import { InputInviteOnly } from "components/inputs/inputsMission/InviteOnly";
import { InputWadge } from "components/inputs/inputsMission/Wadge";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { CreationFeatures } from "sections/Features";
import { _getName } from "utils/auth-tools";

export const ModalCreateMission = () => {
  const [open, setOpen] = useState(false);
  const { cv } = useAuthState();

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Create a Mission
      </button>
      {open && (
        <>
          <div
            className="w-screen top-0 left-0 h-screen fixed opacity-70 bg-black"
            onClick={() => setOpen(false)}
          ></div>
          <div className="fixed left-1/2 z-100 bg-zinc-900 -translate-x-1/2 -translate-y-1/2 top-1/2 p-5 w-[90vw] h-[85vh]">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {cv ? (
                <>
                  Hi , <CVName /> !
                </>
              ) : (
                "Hi, you should registred before continue"
              )}{" "}
            </h3>
            <CreationFeatures />
          </div>
        </>
      )}
    </>
  );
};
