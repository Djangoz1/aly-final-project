import { fetchJSONByCID } from "./pinata-tools";

export const calcTierAverage = (datas, target) => {
  let result = 0;

  for (let index = 0; index < datas.tiers.length; index++) {
    const element = datas.tiers?.[index];
    result += parseInt(element[target]);
  }
  if (target === "tokenPrice") result = result / datas.tiers.length;

  return result;
};

// export const getLaunchpadDatas = async (address) => {
//   const datas = await _getterLaunchpad(address, "getDatas");
//   let amountRaised = 0;

//   for (let index = 0; index < datas?.numberOfTier; index++) {
//     const element = await _getterLaunchpad(address, "getTierDatas", [index]);
//     amountRaised += parseInt(element?.amountRaised);
//   }
//   const currentTier = await _getterLaunchpad(address, "getCurrentTierID");
//   const tier = await _getterLaunchpad(address, "getTierDatas", [currentTier]);
//   datas.tokenPrice = tier.tokenPrice;

//   let owner = await _getterLaunchpad(address, "owner");
//   datas.owner = await _getterAccessControl("getCVByAddress", [owner]);
//   datas.metadata = await fetchJSONByCID(datas.pubURI);
//   datas.currentTier = parseInt(currentTier) + 1;
//   datas.amountRaised = amountRaised;

//   let token = {};
//   token.symbol = await _getterERC20(datas?.tokenAddress, "symbol");
//   token.name = await _getterERC20(datas?.tokenAddress, "name");
//   token.totalSupply = await _getterERC20(datas?.tokenAddress, "totalSupply");
//   token.allowance = await _getterERC20(datas?.tokenAddress, "totalSupply", [
//     owner,
//     address,
//   ]);

//   datas.token = token;

//   return datas;
// };
