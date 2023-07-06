import React from "react";

export const NoteCard = ({ content, user, created_at, hashtags }) => {
  return (
    <div className="rounded p-16 border border-gray-600 bg-gray-700 flex flex-col gap-16 break-words">
      <div className="flex gap-12 items-center">
        <img
          src={user?.image}
          alt="note"
          className="rounded-full w-20 aspect-square bg-gray-100"
        />
        <div>
          <a
            href={`https://notr.guru/p/${user?.pubkey}`}
            className="   text-white"
            target="_blank"
            rel="noreferrer"
          >
            <span className=" ">{user?.name}</span>
          </a>
          <p className="text-body3 text-gray-400">
            {created_at &&
              new Date(created_at * 1000).toISOString().split("T")[0]}
          </p>
        </div>
      </div>

      <p>{content}</p>
      <ul className="flex flex-wrap gap-12">
        {hashtags
          ?.filter((t) => hashtags.indexOf(t) === hashtags.lastIndexOf(t))
          ?.map((hashtag) => (
            <li key={hashtag} className="badge badge-primary">
              #{hashtag}
            </li>
          ))}
      </ul>
    </div>
  );
};
