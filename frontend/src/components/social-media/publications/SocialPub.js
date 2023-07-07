import React from "react";

export const SocialPub = ({ pub }) => {
  console.log(pub);
  return <div>{pub?.metadata?.content}</div>;
};
