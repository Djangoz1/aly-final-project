import { clientPocket } from "utils/ui-tools/pinata-tools";
import { stateDispute } from "utils/ui-tools/state-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

export const controllersDispute = {
  create: async (form) => {
    let id = parseInt(form.feature.id);
    console.log("wshhh start", form);
    let metadatas = {
      description: form.description,
      image: form?.image,
      featureID: form.feature.hash,
    };

    if (form?.appeal > 0 && form?.arbitrators >= 3) {
      const record = await clientPocket.records.create("escrows", metadatas);
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
    list: async ({ disputes }) => {
      if (disputes) {
        let lists = [];
        for (let index = 0; index < disputes.length; index++) {
          lists.push(await stateDispute(disputes[index]));
        }
        return lists;
      }
    },
  },
};
