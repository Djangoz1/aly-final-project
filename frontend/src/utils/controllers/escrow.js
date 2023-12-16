import { clientPocket } from "utils/ui-tools/pinata-tools";
import { stateDispute, stateFeature } from "utils/ui-tools/state-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { createURI } from ".";

export const controllersDispute = {
  create: async ({
    feature,
    appeal,
    arbitrators,
    description,
    image,
    datas,
  }) => {
    if (!datas) {
      throw new Error("create dispute: Missing argument");
    }
    let featureID = [...datas.features, ...datas.proposals][feature];
    let _feature = await stateFeature(featureID);
    let metadatas = {
      description: description,
      image: image,
      featureID: _feature.metadatas.id,
    };

    if (appeal > 0 && arbitrators >= 3) {
      const record = await createURI("escrows", metadatas);
      let uri = record?.id;

      let hash = await _apiPost("contestFeature", [
        featureID,
        parseInt(appeal),
        parseInt(arbitrators),
        uri,
      ]);

      let disputeID = await _apiGet("disputeOfFeature", [id]);
      await _apiPost("initDispute", [disputeID]);

      return {
        hash,
        id,
        url: "/mission/" + _feature.datas.missionID,
        label: _feature.metadatas.title,
      };
    } else {
      throw new Error("Missing escrow values");
    }
  },
  get: {
    // indexer disputes ID
    list: async ({ disputes, features }) => {
      if (disputes) {
        let lists = [];
        for (let index = 0; index < disputes.length; index++) {
          lists.push(await stateDispute(disputes[index]));
        }
        return lists;
      } else if (features) {
        let lists = [];
        for (let index = 0; index < features.length; index++) {
          lists.push({
            ...(await stateDispute(features[index].datas?.dispute)),
            feature: features[index],
          });
        }
        return lists;
      }
    },
  },
};
