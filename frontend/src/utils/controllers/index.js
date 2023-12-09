import { clientPocket } from "utils/ui-tools/pinata-tools";
import { _apiGet, _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";
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
    feature: async ({
      title,
      value,
      launchpadID,
      description,
      estimatedDays,
      isInviteOnly,
      specification,
      abstract,
      skills,
      deployed,
      image,
      featureHash,
      domain,
      missionID,
      missionHash,
    }) => {
      if (!missionID || !missionHash || !title) {
        throw new Error(`Missing required value : {
          missionID : ${missionID},
          missionHash : ${missionHash},
          title : ${title},
        }`);
      }
      let uri = featureHash;

      let feature = uri
        ? await clientPocket.records.getOne("features", uri)
        : undefined;
      let featureID;
      let metadatas = {
        image: image || feature?.image,
        missionID: missionHash,
        domain: domain || feature?.domain,
        abstract: abstract || feature?.abstract,
        skills: skills || feature?.skills,
        title: title,
        description: description || feature?.description,
      };
      let formData = new FormData();
      formData.append("image", metadatas?.image);

      // formData.append("image", metadatas.image);
      console.log("metada---------tas", metadatas);

      if (featureHash) {
        deployed = true;
      } else {
        let result = await clientPocket.records.create("features", metadatas);
        await clientPocket.records.update("features", result.id, formData);
        uri = result.id;
      }
      if (deployed) {
        if (!description || !title || !domain) {
          throw new Error(`Missing required deployed value: {
            description : ${description},
            title : ${title},
            domain : ${domain},
          } `);
        }

        if (launchpadID) {
          await _apiPost("createFeatureLaunchpad", [
            value,
            missionID,
            estimatedDays,
            isInviteOnly,
            uri,
            specification,
          ]);
        } else {
          await _apiPostPayable(
            "createFeature",
            [missionID, estimatedDays, isInviteOnly, uri, specification],
            value
          );
        }
        featureID = await _apiGet("tokensLengthOf", [ADDRESSES["featuresHub"]]);
        await clientPocket.records.update("features", uri, {
          deployedID: parseInt(featureID),
          ...metadatas,
          formData,
        });
      }
      return { featureID, featureHash: uri };
    },
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
      list: ({ mission, userID, launchpad }) => {
        if (mission) {
          return controllersPub.get.list({
            missionHash: mission?.metadatas?.id,
          });
        } else if (userID) {
          return controllersPub.get.list({ userID });
        } else if (launchpad) {
          return controllersPub.get.list({
            launchpadHash: launchpad?.metadatas?.id,
          });
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

        for (let index = 0; index < result.items.length; index++) {
          let record = await clientPocket.records.getOne(
            "messages",
            result.items[index].id,
            {
              expand: expand
                ? expand
                : userID === result.items[index].senderID
                ? "receiverID"
                : "senderID",
            }
          );
          list.push(record);
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
      item: async ({ featureID, featureHash, withOwner, expand }) => {
        if (withOwner && !featureID) {
          throw new Error("featureID is required for get owner");
        }

        let result = {};
        if (featureID) {
          let feature = await stateFeature(featureID);
          featureHash = feature.metadatas.id;
          result = {
            featureID,
            datas: {
              specification: feature.datas.specification,
              missionID: feature?.datas?.missionID,
            },
          };
          if (withOwner) {
            let owner = await controllers.get.profile.item({
              cvID: feature.datas.owner,
            });
            result = {
              ...result,

              owner: { cvID: owner.cvID, metadatas: owner.metadatas },
            };
          }
        }
        let metadatas = await clientPocket.records.getOne(
          "features",
          featureHash,
          { expand }
        );
        return { ...result, metadatas };
      },
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
