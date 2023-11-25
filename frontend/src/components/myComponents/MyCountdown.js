import { Hg } from "components/text/HeroGradient";
import { useToolsState } from "context/tools";
import React, { useEffect, useState } from "react";
import { timestampToCounter } from "utils/ux-tools";

export const MyCountdown = ({ count, timestamp, style, size, range }) => {
  function createCountdown(startDateTimestamp, daysRemaining) {
    if (
      typeof startDateTimestamp !== "number" ||
      isNaN(startDateTimestamp) ||
      daysRemaining <= 0
    ) {
      throw new Error(
        "Veuillez fournir une date de départ valide et un nombre de jours positif."
      );
    }

    const targetDateTimestamp = !range
      ? startDateTimestamp + daysRemaining * 24 * 60 * 60 * 1000
      : new Date(range.end);

    function updateCounter() {
      const currentDate = new Date(range?.start) || new Date().getTime();
      const timeRemaining = targetDateTimestamp - currentDate;
      if (timeRemaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else {
        const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor(
          (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        );
        const minutes = Math.floor(
          (timeRemaining % (60 * 60 * 1000)) / (60 * 1000)
        );
        const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

        return { days, hours, minutes, seconds };
      }
    }

    return updateCounter;
  }

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = range ? new Date(range?.end) : timestamp - now;

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
      if (count) {
        setTimeLeft(createCountdown(timestamp, count));
      } else {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timestamp]);

  return (
    <>
      <div
        className={`grid grid-flow-col ${style} gap-4 text-center auto-cols-max ${
          size ? `text-[${size}px]` : "text-lg"
        }`}
      >
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeLeft.days }}></span>
          </span>
          <p className="c2">days</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeLeft.hours }}></span>
          </span>
          <p className="c2">hours</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeLeft.minutes }}></span>
          </span>
          <p className="c2">min</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeLeft.seconds }}></span>
          </span>
          <p className="c2">sec</p>
        </div>
      </div>
    </>
  );
};

export const MyCounter = ({ startDate, size, endDate }) => {
  const [isEnd, setEnd] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const tools = useToolsState();
  // Fonction pour calculer le temps restant entre la date de début et la date de fin
  function calculateTimeRemaining() {
    const currentTime = new Date().getTime();
    const endTime = endDate;
    const timeLeft = endTime - currentTime;

    if (timeLeft <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    if ((endDate && !isEnd) || endDate !== isEnd) {
      if (endDate) {
        setEnd(endDate);
      }
    }
  }, [endDate]);

  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    if (isEnd) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isEnd, tools?.pointer]);

  return (
    <>
      <div className="grid grid-flow-col  gap-5 text-center auto-cols-max">
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeRemaining.days }}></span>
          </span>
          <p className="c2">days</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeRemaining.hours }}></span>
          </span>
          <p className="c2">hours</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeRemaining.minutes }}></span>
          </span>
          <p className="c2">min</p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className={` countdown font-mono ${
              size ? `text-[${size + 8}px]` : "text-2xl"
            } `}
          >
            <span style={{ "--value": timeRemaining.seconds }}></span>
          </span>
          <p className="c2">sec</p>
        </div>
      </div>
    </>
  );
};
