// import { parseHex } from "helpers";
// import { _getContractFactoryCV } from "./auth-tools";

// export const _getAllCVs = async () => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     const factoryCv = await _getContractFactoryCV();
//     const length = parseHex(await factoryCv.getCVsLength());
//     const arr = [];
//     for (let index = 0; index < length; index++) {
//       const element = await factoryCv.getCVById(index);
//       arr.push(element);
//     }
//     console.log("arr", arr);

//     return arr;
//   }
// };
