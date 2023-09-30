import React from "react";
import { Scene } from "spline/Scene";
import { styles } from "styles/style";
import { CreateLaunchpad } from "./form/CreateLaunchpad";
import { spline } from "constants/spline";
import { Hg } from "components/text/HeroGradient";
import { LinearGradient } from "react-text-gradients";
import { Icon } from "@iconify/react";
import { icfy } from "icones";

export const HeroLaunchpad = () => {
  return (
    <div className="w-full flex">
      <div className="w-2/4">
        <LinearGradient
          className="text-xs leading-0 font2 uppercase"
          gradient={["to right", "rgba(201,78,21,0.92), rgba(201,21,103,1)"]}
        >
          Powered by community
        </LinearGradient>
        <h3 className={styles.hero}>
          Crypto startups <br />
          with <Hg>growth</Hg> right
          <br /> from the <Hg>start</Hg>
        </h3>
        <div className="flex items-center">
          <div className="badge badge-error badge-xs mr-3" />
          Only available for ERC20 token
        </div>
        <div className="mt-5">
          <button className="cta-button btn border-none mr-4  freelance">
            <>
              <Icon icon={icfy.ux.checkList} className={""} />
              View all
            </>
          </button>
          <CreateLaunchpad />
        </div>
      </div>
      <div className="flex flex-col w-2/4">
        <div className="cta-button project-owner h-fit py-10 overflow-hidden mask mask-hexagon  ">
          <div className=" w-fit mx-auto py-10">
            <Scene url={spline.rocket} />
          </div>
        </div>
      </div>
    </div>
  );
};
