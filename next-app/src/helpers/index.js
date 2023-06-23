import { ethers } from "ethers";

export const parseHex = (number) =>
  ethers.BigNumber.from(number._hex).toNumber();
