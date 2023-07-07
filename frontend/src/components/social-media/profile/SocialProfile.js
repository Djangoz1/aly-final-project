import Link from "next/link";
import React from "react";

export const SocialProfile = ({ profile }) => {
  return (
    <div className="flex min-h-30 border border-black/10 flex-col">
      <img
        src={
          profile?.picture?.original?.url ||
          `https://api.dicebear.com/5.x/identicon/svg?seed=${profile?.ownedBy}`
        }
        className="w-[60px]"
        alt="img profile"
      />
      <p className="text-xs">{profile?.handle}</p>

      <Link href={`/profile/${profile?.id}`}>{profile?.name}</Link>
      <p className="text-xs">{profile?.bio}</p>
      <p className="text-xs">{profile?.stats?.totalFollowers}</p>
      <p className="text-xs">{profile?.stats?.totalFollowing}</p>
      <p className="text-xs">{profile?.stats?.totalPosts}</p>
      <p className="text-xs">{profile?.stats?.totalPublications}</p>
    </div>
  );
};
