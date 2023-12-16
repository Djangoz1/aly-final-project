import React from "react";
import { MyInput } from "./MyInput";
import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
export const labelFormSocial = "You can add a social profiles if you want";
export const FormSocial = () => {
  return (
    <div className={"flex flex-col w-full gap-2 "}>
      <MyInput
        label={false}
        styles={"w-full"}
        icon={icfyFB}
        target={"facebook"}
      />
      <MyInput
        label={false}
        styles={"w-full"}
        icon={icfyLINKEDIN}
        target={"linkedin"}
      />
      <MyInput
        label={false}
        styles={"w-full"}
        icon={icfyGITHUB2}
        target={"github"}
      />
      <MyInput
        label={false}
        styles={"w-full"}
        icon={icfyTWITTER}
        target={"twitter"}
      />
    </div>
  );
};
