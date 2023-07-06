import React from "react";
import { SocialProfile } from "./SocialProfile";
import { v4 as uuidv4 } from "uuid";
export const ListSocialProfiles = ({ profiles }) => {
  console.log("koooukou", profiles);
  return (
    <div className="flex flex-col w-full">
      {profiles.map((profile, index) => (
        <SocialProfile key={uuidv4()} profile={profile} />
      ))}
    </div>
  );
};
