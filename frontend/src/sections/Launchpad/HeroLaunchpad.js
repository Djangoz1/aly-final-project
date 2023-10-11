import React from "react";
import { Scene } from "spline/Scene";
import { styles } from "styles/style";
import { spline } from "constants/spline";
import { Hg } from "components/text/HeroGradient";
import { LinearGradient } from "react-text-gradients";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { BtnGr1 } from "components/myComponents/btn/MyGradientButton";

export const HeroLaunchpad = () => {
  return (
    <div className="w-full items-center h-full flex">
      <div className="w-2/4 mt-auto">
        <LinearGradient
          className="text-xs leading-0 font2 uppercase"
          gradient={["to right", "rgba(201,78,21,0.92), rgba(201,21,103,1)"]}
        >
          Powered by community
        </LinearGradient>
        <h3 className={styles.hero}>
          Growth your <br />
          <Hg>startups</Hg> right
          <br /> from the <Hg>start</Hg>
        </h3>
        <div className="flex items-center">
          <div className="badge badge-error badge-xs mr-3" />
          Only available for ERC20 token
        </div>
      </div>
    </div>
  );
};
