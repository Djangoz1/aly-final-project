import { clientPocket } from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { createURI } from ".";
import { ethers } from "ethers";

export const controllersPub = {
  create: async (form) => {
    if (!form.owner.id) {
      throw new Error("Missing owner ID");
    }
    try {
      let metadatas = {
        description: form.description,
        image: form?.image,
        postID: form?.answerID,
        missionID: form?.mission?.metadatas?.id,
        launchpadID: form?.launchpadID,
        title: form?.payable ? form?.title : undefined,
        tags: form?.tags,
        userID: form.owner.id,
        preview: form?.payable ? form?.preview : undefined,
      };

      if (form?.payable && !form?.preview && !form?.file && !form?.amount) {
        throw new Error("Missing file, amount or preview");
      }
      let record = await createURI("posts", metadatas);
      let hash;

      if (form?.payable) {
        hash = await createURI("payable_posts", {
          file: form?.file,
          postID: record,
        });
        await _apiPost("createPayablePub", [
          record,
          ethers.utils.parseEther(form?.amount)?._hex,
          hash,
        ]);
      }
      //   if (!answerID) {
      //     hash = await _apiPost("createPub", [record.faispayablepubmetadatas]);
      //   }
      return { record, hash };
    } catch ({ error }) {
      console.log("Error create pub", error);
    }
  },
  get: {
    list: async ({ userID, missionHash, launchpadHash }) => {
      if (missionHash) {
        const resultList = await clientPocket.records.getList("posts", 1, 50, {
          filter: `missionID = "${missionHash}"`,
        });

        let lists = [];
        for (let index = 0; index < resultList.items.length; index++) {
          const element = resultList.items[index];
          let owner = await clientPocket.records.getOne(
            "accounts",
            element?.userID
          );
          lists.push({ metadatas: element, owner });
        }
        return lists;
      } else if (launchpadHash) {
        const resultList = await clientPocket.records.getList("posts", 1, 50, {
          filter: `launchpadID = "${launchpadHash}"`,
        });

        let lists = [];
        for (let index = 0; index < resultList.items.length; index++) {
          const element = resultList.items[index];
          let owner = await clientPocket.records.getOne(
            "accounts",
            element?.userID
          );
          lists.push({ metadatas: element, owner });
        }
        return lists;
      } else if (userID) {
        const resultList = await clientPocket.records.getList("posts", 1, 50, {
          filter: `userID = "${userID}"`,
        });

        let lists = [];
        return resultList.items.map((el) => ({ metadatas: el }));
      }
    },
  },
};
