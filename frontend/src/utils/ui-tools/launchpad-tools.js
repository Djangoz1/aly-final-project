export const calcTierAverage = (datas, target) => {
  let result = 0;

  for (let index = 0; index < datas.tiers.length; index++) {
    const element = datas.tiers?.[index];
    result += parseInt(element[target]);
  }
  if (target === "tokenPrice") result = result / datas.tiers.length;

  return result;
};
