import Link from "next/link";
import React from "react";

export const SocialProfile = ({ profile }) => {
  return (
    <div className="flex min-h-30 border border-black/10 flex-col">
      <img src={profile?.picture?.original?.url} alt="img profile" />
      <p className="text-xs">{profile?.handle}</p>

      <Link href={`/profile/${profile?.id}`}>{profile?.name}</Link>
      <p className="text-xs">{profile?.bio}</p>
    </div>
  );
};
