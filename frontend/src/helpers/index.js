// import { DEV_LANGUAGES } from "constants/languages";
// import { ethers } from "ethers";

// export const parseHex = (number) => {
//   if (number?._hex)
//     return number && ethers.BigNumber.from(number._hex).toNumber();
// };

// export const parseToHex = (number) => number && ethers?.utils?.hexlify(number);

// export const parseTimestamp = (_timestamp) => {
//   let timestamp;
//   if (_timestamp?._hex) {
//     timestamp = parseHex(_timestamp);
//   } else {
//     timestamp = _timestamp;
//   }
//   const date = new Date(timestamp * 1000);
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   // const hours = date.getHours();
//   // const minutes = date.getMinutes();
//   // const seconds = date.getSeconds();

//   const formattedDate = `${day}/${month}/${year}`;

//   return formattedDate;
// };

// export const calcTimestamp = (_timestamp, _dayValue) => {
//   const oppenedAt = parseHex(_timestamp) * 1000;
//   const duration = _dayValue * 24 * 60 * 60 * 1000;
//   const closeTimestamp = oppenedAt + duration;

//   const now = new Date().getTime();

//   const distance = closeTimestamp - now;

//   if (distance < 0) {
//     // Le temps est écoulé
//     return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//   }

//   const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

//   return { days, hours, minutes };
// };

// export const selectLanguage = (string) => {
//   const newString = string?.split(": ");
//   let result;
//   for (let index = 0; index < DEV_LANGUAGES.length; index++) {
//     const element = DEV_LANGUAGES[index];
//     if (element.name === newString?.[0]) {
//       result = element;
//     }
//   }
//   return result;
// };