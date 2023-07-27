import { MyBottomSection, MySection } from "components/myComponents/MySection";
import { rocket } from "constants/spline";
import React from "react";
import { LinearGradient } from "react-text-gradients";
import { Rocket, Scene } from "spline/Scene";

export const HeroLaunchpad = () => {
  const stats = [
    { title: "Launchpad created", value: "100" },
    { title: "Amount raised", value: "100k" },
    { title: "Investors", value: "10k" },
  ];
  return (
    <div className="flex  flex-col">
      <MySection styles={" items-center"}>
        <div className="flex flex-col">
          <h2 className="font-black text-[50px]">
            <LinearGradient gradient={["to left", "red , cyan"]}>
              Launchpad
            </LinearGradient>
          </h2>
          <p className="text-justify w-2/3">
            stands for Hue, Saturation, and Lightness. The values are based on a
            position from the center of a color wheel. The value for Hue is from
            0 to 360, representing the degrees on a color wheel. Saturation is
            the distance from the center of the color wheel. The L stands for
            Lightness, which represents the preceived liminance of the color.
          </p>
        </div>
        <div className="w-fit ml-auto">
          <Scene url={rocket} />
        </div>
      </MySection>
      <MyBottomSection stats={stats} />
    </div>
  );
};
