import React from "react";
import { SocialPub } from "./SocialPub";
import { v4 as uuidv4 } from "uuid";
export const ListSocialPubs = ({ pubs }) => {
  return (
    <div>
      {pubs?.items?.map((pub) => (
        <SocialPub key={uuidv4()} pub={pub} />
      ))}
    </div>
  );
};
