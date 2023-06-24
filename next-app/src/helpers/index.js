import { ethers } from "ethers";

export const parseHex = (number) =>
  ethers.BigNumber.from(number._hex).toNumber();

export const parseToHex = (number) => ethers.utils.hexlify(number);
