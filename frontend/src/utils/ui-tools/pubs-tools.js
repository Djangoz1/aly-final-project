const { fetchJSONByCID } = require("./pinata-tools");
const { _getterPubsHub } = require("./web3-tools");

export const _getAllPubsState = async () => {
  const length = parseInt(await _getterPubsHub("getTokensLength"));
  const arr = [];
  for (let index = 1; index <= length; index++) {
    const pubURI = await _getterPubsHub("tokenURI", [index]);
    const metadata = await fetchJSONByCID(pubURI);
    metadata.owner = await _getterPubsHub("ownerOf", [index]);
    arr.push(metadata);
  }
  return arr;
};
