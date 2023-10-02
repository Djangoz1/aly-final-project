import React from "react";
import { Scene } from "spline/Scene";
import { styles } from "styles/style";
import { CreateLaunchpad } from "./form/CreateLaunchpad";
import { spline } from "constants/spline";
import { Hg } from "components/text/HeroGradient";
import { LinearGradient } from "react-text-gradients";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { BtnGr1 } from "components/myComponents/btn/MyGradientButton";

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
          <BtnGr1 style=" mr-4">
            <>
              <Icon icon={icfy.ux.checkList} className={""} />
              View all
            </>
          </BtnGr1>
          <CreateLaunchpad />
        </div>
      </div>
      <div className="flex flex-col  overflow-visible relative w-fit">
        <div className=" w-fit mx-auto   z-10 py-10">
          <div className="blob2 w-[600px] h-[500px] -mt-5  relative top-0   z-10 right-0">
            <div className="mask mask-hexagon flex flex-col items-center justify-center  g1 gr1 ">
              <Scene
                url={spline.rocket}
                styles={"z-100 relative p-10  flex justify-center mx-auto"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
