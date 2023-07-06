"use client";
import { CreateNote } from "components/community/CreateNote";
import { NotesList } from "components/community/NotesList";
import { SimplePool, Event } from "nostr-tools";
// import { Filter } from "nostr-tools/lib/filter";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "sections/Layout";
import { useDebounce } from "use-debounce";
import { insertEventIntoDescendingList } from "utils/ux-tools";

export const RELAYS = [
  "wss://nostr-pub.welorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];

// inferface Metadata {
//     name?: stringToBytes;
//     picture?: stringToBytes;
//     nip05?:stringToBytes;
// }

const Community = () => {
  const [pool, setPool] = useState(null);
  // setuip a relays pool
  const [eventsImmediate, setEvents] = useState([]);
  // catch newEvents with use-debounce lib
  const [events] = useDebounce(eventsImmediate, 1500);
  //   metadata author
  const [metadata, setMetadata] = useState({});

  //   check if already subscribed
  const metadataFetched = useRef({});

  useEffect(() => {
    const _pool = new SimplePool();
    setPool(_pool);

    return () => {
      _pool.close(RELAYS);
    };
  }, []);

  // subscribe to some events
  useEffect(() => {
    if (!pool) return;
    const sub = pool.sub(RELAYS, [
      {
        kinds: [1],
        limit: 100,
        "#t": ["nostr"],
      },
    ]);

    sub.on("event", (event) => {
      setEvents((events) => insertEventIntoDescendingList(events, event));
    });

    return () => {
      sub.unsub();
    };
  }, [pool]);

  // Get author metadata
  useEffect(() => {
    if (!pool) return;
    const pubkeysToFetch = events
      .filter((event) => metadataFetched.current[event.pubkey] !== true)
      .map((event) => event.pubkey);

    pubkeysToFetch.forEach(
      (pubkey) => (metadataFetched.current[pubkey] = true)
    );

    const sub = pool.sub(RELAYS, [
      {
        kinds: [0],
        authors: pubkeysToFetch,
      },
    ]);

    sub.on("event", (event) => {
      const metadata = JSON.parse(event.content);
      setMetadata((current) => ({
        ...current,
        [event.pubkey]: metadata,
      }));
    });

    sub.on("eose", () => {
      sub.unsub();
    });

    return () => {
      //   sub.unsub();
    };
  }, [events, pool]);

  // render the events

  return (
    <Layout>
      <div>
        Community
        <CreateNote />
        <NotesList notes={events} metadata={metadata} />
      </div>
    </Layout>
  );
};

export default Community;
