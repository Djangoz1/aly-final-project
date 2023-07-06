import React, { useState } from "react";
import { getEventHash } from "nostr-tools";
export const CreateNote = () => {
  const [input, setInput] = useState("");
  const onSubmit = async (e) => {
    e.prevendDefault();
    if (!window.nostr) {
      alert("nostr is not installed");
      return;
    }
    console.log(input);

    // construct  the event object
    const baseEvent = {
      content: input,
      create_at: Date.now() / 1000,
      kind: 1,
      tags: [],
    };

    //  sign this event (allow the user to sign it with ther private key)
    // ? check if the user has a nostr extension
    try {
      const pubkey = await window.nostr.getPubkey();
      const sig = await window.nostr.signEvent(baseEvent).sig;
      const event = {
        ...baseEvent,
        sig,
        id: getEventHash({ ...baseEvent, pubkey }),
        pubkey,
      };
      console.log(event);
    } catch (error) {
      alert("User rejected operation");
    }
    // ? get the user pubkey
    // ? prompte the user to sign the event

    // publish the event to relays
  };
  return (
    <div>
      <h2 className="text-2xl font-black text-black mb-12 ">
        What's In your Mind ?
      </h2>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Write your note here ..."
          className="text-area w-full h-32"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
        />
        <div className="flex justify-end">
          <button className="bg-violet-500 px-16 py-4 rounded-8 font-bold hover:bg-violet-600 active:scale-90">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};
