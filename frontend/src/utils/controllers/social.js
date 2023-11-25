import { clientPocket } from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";

export const controllersPub = {
  create: async (form) => {
    try {
      let metadatas = {
        description: form.description,
        image: form?.image,
        postID: form?.answerID,
        missionID: form?.mission?.metadatas?.id,
        title: form?.title,
        tags: form?.tags,
        userID: form.owner.id,
      };

      let record = await clientPocket.records.create("posts", metadatas);
      let hash;
      //   if (!answerID) {
      //     hash = await _apiPost("createPub", [record.faispayablepubmetadatas]);
      //   }
      return { record, hash };
    } catch ({ error }) {
      console.log("Error create pub", error);
    }
  },
  get: {
    list: async ({ userID, missionHash }) => {
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
      } else if (userID) {
        const resultList = await clientPocket.records.getList("posts", 1, 50, {
          filter: `userID = "${userID}"`,
        });

        let lists = [];
        return resultList.items.map((el) => {
          return { metadatas: el };
        });
      }
    },
  },
};
