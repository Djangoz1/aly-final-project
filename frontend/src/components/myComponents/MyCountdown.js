import { Hg } from "components/text/HeroGradient";
import React, { useEffect, useState } from "react";

export const MyCountdown = ({ timestamp }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = timestamp - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [timestamp]);

  return (
    <>
      <div className="grid grid-flow-col text-xs gap-5 text-center auto-cols-max">
        <div className="flex flex-col items-center">
          <span className="text-white countdown font-mono text-xl">
            <span style={{ "--value": timeLeft.days }}></span>
          </span>
          <Hg>days</Hg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white countdown font-mono text-xl">
            <span style={{ "--value": timeLeft.hours }}></span>
          </span>
          <Hg>hours</Hg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white countdown font-mono text-xl">
            <span style={{ "--value": timeLeft.minutes }}></span>
          </span>
          <Hg>min</Hg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white countdown font-mono text-xl">
            <span style={{ "--value": timeLeft.seconds }}></span>
          </span>
          <Hg>sec</Hg>
        </div>
      </div>
    </>
  );
};
