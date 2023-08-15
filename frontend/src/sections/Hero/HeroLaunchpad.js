import { Icon } from "@iconify/react";
import { MyCard } from "components/myComponents/MyCard";
import { MyBottomSection, MySection } from "components/myComponents/MySection";
import { rocket } from "constants/spline";
import { icfySEARCH } from "icones";
import React from "react";
import { LinearGradient } from "react-text-gradients";
import { Rocket, Scene } from "spline/Scene";
import { inputStyle } from "styles/style";

export const HeroLaunchpad = () => {
  const stats = [
    { title: "Launchpad created", value: "100" },
    { title: "Amount raised", value: "100k" },
    { title: "Investors", value: "10k" },
  ];
  return (
    <div className="flex  flex-col">
      <MySection styles={"flex flex-col h-screen mt-10"}>
        <div className="flex">
          <div className="w-1/2 pr-10">
            <h6 className="text-white  font-prim font-bold text-[35px]">
              Propel your skills through blockchain technology <br /> & build a
              new labor market
            </h6>
            <p>Work on your decentralization.</p>
          </div>
          <img src="/hero.avif" className="w-1/2 py-5" />
        </div>
        <MyCard styles={"w-full mt-12 mx-auto flex flex-col"}>
          <div class="relative flex items-center  w-full">
            <span class="absolute">
              <Icon icon={icfySEARCH} className="text-2xl ml-2" />
            </span>

            <input
              type="text"
              placeholder="Write a language technology"
              className={`block w-full text-xs py-3  text-gray-700  placeholder-white-400/70   pl-11 pr-5 rtl:pr-11 rtl:pl-5 rounded-full ${inputStyle}`}
            />
          </div>
          <div className="flex justify-evenly text-white mt-4">
            <div className="btn btn-secondary btn-outline rounded-full btn-xs">
              Trouver un freelance
            </div>
            ou
            <div className="btn btn-primary rounded-full  btn-xs">
              Trouver un projet
            </div>
          </div>
        </MyCard>
      </MySection>
    </div>
  );
};
// {/* <MySection styles={" items-center"}>
//   <div className="flex flex-col">
//     <h2 className="font-black text-[50px]">
//       <LinearGradient gradient={["to left", "red , cyan"]}>
//         Launchpad
//       </LinearGradient>
//     </h2>
//     <p className="text-justify w-2/3">
//       stands for Hue, Saturation, and Lightness. The values are based on a
//       position from the center of a color wheel. The value for Hue is from
//       0 to 360, representing the degrees on a color wheel. Saturation is
//       the distance from the center of the color wheel. The L stands for
//       Lightness, which represents the preceived liminance of the color.
//     </p>
//   </div>
//   <div className="w-fit ml-auto">
//     <Scene url={rocket} />
//   </div>
// </MySection>
// <MyBottomSection stats={stats} /> */}
