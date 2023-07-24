import { DEV_DOMAIN, DEV_LANGUAGES } from "constants/languages";

export const parseTimestamp = (_timestamp) => {
  let timestamp;

  timestamp = parseInt(_timestamp);
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

export const parseTimestamp1 = (_timestamp) => {
  let timestamp;

  timestamp = parseInt(_timestamp);
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

export const calcTimeRemaining = (timestamp) => {
  const now = new Date().getTime();

  const difference = timestamp - now;

  if (difference > 0) {
    const oneMinute = 60 * 1000;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    const days = Math.floor(difference / oneDay);
    const hours = Math.floor((difference % oneDay) / oneHour);
    const minutes = Math.floor((difference % oneHour) / oneMinute);

    return { days, hours, minutes };
  } else {
    return { days: 0, hours: 0, minutes: 0 };
  }
};

export const calcTimestamp = (_timestamp, _dayValue) => {
  const oppenedAt = parseInt(_timestamp) * 1000;
  const duration = _dayValue * 24 * 60 * 60 * 1000;
  const closeTimestamp = oppenedAt + duration;

  const now = new Date().getTime();

  const distance = closeTimestamp - now;

  if (distance < 0) {
    // Le temps est écoulé
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

export const selectLanguage = (string) => {
  let result;
  for (let index = 0; index < DEV_LANGUAGES.length; index++) {
    const element = DEV_LANGUAGES[index];
    if (element.name === string) {
      result = element;
    }
  }
  return result;
};
export const selectDevDomain = (string) => {
  let result;
  for (let index = 0; index < DEV_DOMAIN.length; index++) {
    const element = DEV_DOMAIN[index];
    if (element.name === string) {
      result = element;
    }
  }
  return result;
};
