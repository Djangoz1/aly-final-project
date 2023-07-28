const { fetchJSONByCID } = require("./pinata-tools");
const { _getterPubsHub } = require("./web3-tools");

export const _getPubState = async (index) => {
  const pubURI = await _getterPubsHub("tokenURI", [index]);

  let metadata = await fetchJSONByCID(pubURI);

  metadata.owner = await _getterPubsHub("ownerOf", [index]);
  return metadata;
};
