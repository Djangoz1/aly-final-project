import { clientPocket } from "utils/ui-tools/pinata-tools";
import { stateDispute } from "utils/ui-tools/state-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { createURI } from ".";

export const controllersDispute = {
  create: async (form) => {
    let id = parseInt(form.feature.id);
    let metadatas = {
      description: form.description,
      image: form?.image,
      featureID: form.feature.hash,
    };

    if (form?.appeal > 0 && form?.arbitrators >= 3) {
      const record = await createURI("escrows", metadatas);
      let uri = record?.id;

      let hash = await _apiPost("contestFeature", [
        id,
        parseInt(form?.appeal),
        parseInt(form?.arbitrators),
        uri,
      ]);

      let disputeID = await _apiGet("disputeOfFeature", [id]);

      hash = await _apiPost("initDispute", [disputeID]);
      return hash;
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
