import { clientPocket } from "utils/ui-tools/pinata-tools";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { controllersPub } from "./social";
import { controllersDispute } from "./escrow";
import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateLaunchpad,
} from "utils/ui-tools/state-tools";
import { ADDRESSES } from "constants/web3";
import { fetchCV } from "utils/cvs";

export const controllers = {
  create: {
    pub: (form) => controllersPub.create(form),
    dispute: (form) => controllersDispute.create(form),
    follow: async ({ followID, ownerID }) => {
      if (await controllers.get.profile.follow({ followID, ownerID })) {
        let followsList = await clientPocket.records.getList("follows", 1, 50, {
          filter: `ownerID = "${ownerID}" && followID = "${followID}"`,
        });
        await clientPocket.records.delete("follows", followsList.items[0].id);
      } else {
        await clientPocket.records.create("follows", { ownerID, followID });
      }
    },
    like: async ({ postID, userID }) => {
      if (!postID || !userID) {
        throw new Error("postID and userID are required");
      } else {
        let like = await controllers.get.likes.item({ postID, userID });
        if (like) {
          await clientPocket.records.delete("likes", like?.id);
        } else {
          await clientPocket.records.create("likes", { postID, userID });
        }
      }
    },
    message: async (form) => {
      await clientPocket.records.create("messages", {
        senderID: form.senderID,
        receiverID: form.receiverID,
        message: form.message,
      });
    },
  },
  update: {
    profile: async (metadatas) =>
      await clientPocket.records.update("accounts", metadatas?.id, metadatas),
  },

  get: {
    profile: {
      list: async ({ filter }) => {
        let record = await clientPocket.records.getList("cvs", filter);
        let lists = [];
        for (let index = 0; index < record.items.length; index++) {
          const element = record.items[index];
          let result = {
            ...(await stateCV(element?.cvID)),
            details: await stateDetailsCV(element?.cvID),
          };

          lists.push(result);
        }
        return lists;
      },
      item: async ({ cvID, cvHash }) => {
        return {
          ...(await stateCV(cvID)),
        };
      },
      follow: async ({ ownerID, followID }) => {
        let followsList = await clientPocket.records.getList("follows", 1, 50, {
          filter: `ownerID = "${ownerID}" && followID = "${followID}"`,
        });
        return followsList?.items?.length > 0;
      },
    },
    follower: {
      follow: async ({ ownerID, followID }) => {
        let followsList = await clientPocket.records.getList("follows", 1, 50, {
          filter: `ownerID = "${ownerID}" && followID = "${followID}"`,
        });
        return followsList?.items?.length > 0;
      },
      list: async ({ userID, expand }) => {
        let result = await clientPocket.records.getList("follows", 1, 50, {
          filter: `ownerID = "${userID}"`,
        });

        if (expand) {
          let arr = [];
          for (let index = 0; index < result.items.length; index++) {
            arr.push(
              await clientPocket.records.getOne(
                "follows",
                result?.items?.[index]?.id,
                {
                  expand,
                }
              )
            );
          }
          return arr;
        }
        return result.items;
      },
    },
    pub: {
      list: ({ mission, userID }) => {
        if (mission) {
          return controllersPub.get.list({
            missionHash: mission?.metadatas?.id,
          });
        } else if (userID) {
          return controllersPub.get.list({ userID });
        }
      },
    },
    likes: {
      list: async ({ postID }) => {
        let result = await clientPocket.records.getList("likes", 1, 50, {
          filter: `postID = "${postID}"`,
        });
        return result.items.length;
      },

      item: async ({ userID, postID }) => {
        let filter;
        if (userID && postID) {
          filter = `postID = "${postID}" && userID = "${userID}"`;
        } else if (postID) {
          filter = `postID = "${postID}" `;
        } else if (userID) {
          filter = `userID = "${userID}"`;
        } else {
          throw new Error("userID or postID is required");
        }
        let list = await clientPocket.records.getList("likes", 1, 50, {
          filter,
        });
        return list.items?.[0];
      },
    },
    message: {
      list: async ({ userID, receiverID, expand }) => {
        let result;
        if (receiverID) {
          result = await clientPocket.records.getList("messages", 1, 50, {
            filter: `senderID = "${userID}" && receiverID = "${receiverID}" `,
          });
        } else {
          result = await clientPocket.records.getList("messages", 1, 50, {
            filter: `senderID = "${userID}" || receiverID = "${userID}"`,
          });
        }
        let list = [];
        console.log(expand);
        if (expand) {
          for (let index = 0; index < result.items.length; index++) {
            let record = await clientPocket.records.getOne(
              "messages",
              result.items[index].id,
              {
                expand,
              }
            );
            list.push(record);
          }
        } else {
          list = [...result.items];
        }
        return list;
      },
    },
    launchpad: {
      list: async () => {
        let arr = [];
        let length = parseInt(
          await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])
        );

        for (let index = 1; index <= length; index++) {
          const element = await stateLaunchpad(index);

          arr.push(element);
        }
        return arr;
      },
    },
    escrows: {
      list: ({ features }) =>
        controllersDispute.get.list({
          disputes: features
            ?.map((el) =>
              el?.datas?.dispute > 0 ? el?.datas?.dispute : undefined
            )
            .filter((el) => el > 0),
        }),
    },
    feature: {
      list: async () => {
        let length = await _apiGet("tokensLengthOf", [
          ADDRESSES["featuresHub"],
        ]);
        let result = [];
        for (let index = 1; index < length; index++) {
          let feature = { ...(await stateFeature(index)), owner: null };

          feature.owner = await fetchCV(feature?.datas?.owner);
          result.push(feature);
        }
        return result;
      },
    },
  },
};
