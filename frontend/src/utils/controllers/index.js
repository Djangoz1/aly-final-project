import { clientPocket, urlPocket } from "utils/ui-tools/pinata-tools";
import {
  _apiGet,
  _apiGetAt,
  _apiPost,
  _apiPostPayable,
} from "utils/ui-tools/web3-tools";
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
import axios from "axios";
import { ethers } from "ethers";
export const createURI = async (table, metadatas) => {
  let formData = new FormData();

  for (const key in metadatas) {
    if (metadatas.hasOwnProperty(key) && metadatas[key]) {
      formData.append(key, metadatas[key]);
    }
  }

  try {
    const { data } = await axios.post(
      `${urlPocket}/api/collections/${table}/records`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Définissez le type de contenu approprié
        },
      }
    );

    return data?.id;
  } catch (error) {
    console.error(
      "Erreur " + table + " :",
      error.response ? error.response.data : error.message
    );
  }
};
export const controllers = {
  create: {
    profile: async ({
      username,
      banniere,
      email,
      cvImg,
      firstName,
      image,
      lastName,
      description,
      visibility,
      phone,
      dateOfBirth,
      citizen,
      linkedin,
      github,
      twitter,
      facebook,
      domain,
      skills,
      languages,
    }) => {
      let metadatas = {
        username: username,
        description,
        visibility: visibility === 1,

        banniere,
        email,

        cvImg,
        identity: JSON.stringify(
          {
            firstName,
            lastName,
            phone,
            dateOfBirth,
            citizen,
          },
          null,
          2
        ),
        social: JSON.stringify(
          {
            linkedin,
            github,
            twitter,
            facebook,
          },
          null,
          2
        ),
        avatar: image,
        languages: JSON.stringify(languages, null, 2),
        skills: JSON.stringify(skills, null, 2),
        domain: domain,
      };

      const record = await createURI("accounts", metadatas);

      await _apiPost("createCV", [record]);
      let cvID = await _apiGet("tokensLength", [ADDRESSES.cvsHub]);
      return { id: cvID, cvHash: record, url: "/profile" + cvID };
    },
    launchpad: async ({
      title,
      saleStart,
      saleEnd,
      maxCap,
      minCap,
      maxInvest,
      minInvest,
      description,
      domain,
      bio,
      facebook,
      linkedin,
      twitter,
      github,
      image,
      banniere,
      website,
      company,
    }) => {
      let metadatas = {
        title,
        description,
        domain,
        bio,
        image,
        banniere,
        website,
        social: JSON.stringify(
          {
            facebook,
            github,
            linkedin,
            twitter,
          },
          null,
          2
        ),
        company,
      };
      console.log(metadatas);

      const record = await createURI("launchpads", metadatas);
      let price = await _apiGetAt({
        targetContract: "balancesHub",
        func: "launchpadPrice",
      });
      let tokenURI = record;

      let launchpadData = {
        id: 0,
        minCap: ethers.utils.parseEther(minCap)._hex,
        maxCap: ethers.utils.parseEther(maxCap)._hex,

        minInvest: ethers.utils.parseEther(minInvest)._hex,
        maxInvest: ethers.utils.parseEther(maxInvest)._hex,

        saleStart: new Date(saleStart).getTime(),
        saleEnd: new Date(saleEnd).getTime(),

        amountRaised: 0n,
        totalUser: 0n,
      };

      await _apiPostPayable(
        "createLaunchpad",
        [launchpadData, tokenURI],
        `${price}`
      );

      let launchpadID = await _apiGet("tokensLengthOf", [
        ADDRESSES["launchpadHub"],
      ]);

      return {
        id: launchpadID,
        hash: tokenURI,
        url: "/launchpad/" + launchpadID,
      };
    },
    pub: (form) => controllersPub.create(form),
    escrow: (form) => controllersDispute.create(form),
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

      console.log(metadatas);
      if (featureHash) {
        deployed = true;
      } else {
        let result = await createURI("features", metadatas);

        uri = result;
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
        });
      }
      return {
        featureID,
        featureHash: uri,
        missionID,
        url: "/mission/" + missionID + "/desk",
      };
    },
    mission: async ({
      ai,
      price,
      description,
      datas,
      launchpads,
      domain,
      launchpad,
      abstract,
      title,
      budget,
      image,
      company,
      banniere,
      reference,
    }) => {
      let aiAssisted = ai?.recommandations ? true : false;
      let metadatas = {
        description: aiAssisted ? ai?.recommandations?.detail : description,
        abstact: aiAssisted ? ai?.recommandations?.abstract : abstract,
        title: aiAssisted ? ai?.recommandations?.name : title,
        budget: aiAssisted ? ai?.recommandations?.budget?.total : budget,
        image: image,
        company: company,
        banniere: banniere,
        reference: reference ? datas?.missions[parseInt(reference)] : undefined,

        domain: parseInt(domain),
      };
      console.log(metadatas);
      try {
        let uri = await createURI("missions", metadatas);
        if (!price) {
          throw new Error("Missing price");
        }
        let hash;
        try {
          if (launchpad >= 0 && launchpad !== null) {
            if (launchpads) {
              throw new Error("Launchpads wasn't found");
            }
            hash = await _apiPost("createMissionLaunchpad", [
              launchpads[parseInt(launchpad)],
              uri,
            ]);
          } else {
            hash = await _apiPostPayable(
              "createMission",
              [uri],
              await _apiGetAt({
                func: "missionPrice",
                targetContract: "balancesHub",
              })
            );
          }
        } catch (error) {
          await clientPocket.records.delete("missions", uri);

          return;
        }
        let missionID = await _apiGet("tokensLengthOf", [
          ADDRESSES["missionsHub"],
        ]);

        let featuresHash = [];
        if (aiAssisted) {
          for (
            let index = 0;
            index < ai?.recommandations?.roles.length;
            index++
          ) {
            let element = ai?.recommandations?.roles[index];
            let datas = {
              missionID: missionID,
              missionHash: uri,
              title: element?.role_name,
              abstract: element?.reason,
              deployed: false,
              skills: JSON.stringify(element?.skills_required, null, 2),
            };

            let feature = await controllers.create.feature(datas);
            featuresHash.push(feature.featureHash);
          }
        }

        return {
          featuresHash,
          url: `/mission/${missionID}`,
          label: `${title}`,
          missionID,
          missionHash: hash,
        };
      } catch (error) {
        console.error("create mission ", { error });
      }
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
          features: features?.filter((el) => el?.datas?.dispute > 0),
        }),
    },
    feature: {
      item: async ({ featureID, _full, featureHash, withOwner, expand }) => {
        if (withOwner && !featureID) {
          throw new Error("featureID is required for get owner");
        }

        let result = {};
        if (featureID) {
          let feature = await stateFeature(featureID);
          featureHash = feature.metadatas.id;
          result = {
            featureID,
            datas: _full
              ? feature?.datas
              : {
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
      list: async ({ expand }) => {
        let length = await _apiGet("tokensLengthOf", [
          ADDRESSES["featuresHub"],
        ]);
        let result = [];

        for (let index = 1; index < length; index++) {
          let feature = {
            ...(await controllers.get.feature.item({
              featureID: index,
              expand,
              _full: true,
            })),
            owner: null,
          };

          feature.owner = await fetchCV(feature?.datas?.owner);
          result.push(feature);
        }
        return result;
      },
    },
  },
};
