import { NoteCard } from "./NoteCard";

export const NotesList = ({ notes, metadata }) => {
  return (
    <div className="flex flex-col gap-16">
      {notes?.map((note) => (
        <NoteCard
          key={note.id}
          user={{
            name: metadata[note.pubkey]?.name || note.pubkey,
            image:
              metadata[note.pubkey]?.picture ??
              `https://api.dicebear.com/5.x/identicon/svg?seed=${note.pubkey}`,
            pubkey: note.pubkey,
          }}
          created_at={note?.created_at}
          content={note?.content}
          hashtags={note?.tags?.filter((t) => t[0] === "t").map((t) => t[1])}
        />
      ))}
    </div>
  );
};
