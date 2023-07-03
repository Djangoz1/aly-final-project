import { _getterFactoryCV } from "./web3-tools";

export const _getAllCVs = async () => {
  const length = await _getterFactoryCV("getCVsLength");

  const arr = [];
  for (let index = 0; index < length; index++) {
    const element = await _getterFactoryCV("getCVById", [index]);
    arr.push(element);
  }
  return arr;
};
