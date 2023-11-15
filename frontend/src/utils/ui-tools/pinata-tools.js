require("dotenv").config();
const key = process.env.PINATA_KEY;
import PocketBase from "pocketbase";
const secret = process.env.PINATA_SECRET;

import axios from "axios";
import { ADDRESSES } from "constants/web3";

import { _apiGet } from "utils/ui-tools/web3-tools";

export const clientPocket = new PocketBase("http://127.0.0.1:8090");

export const pinataGateway =
  "https://copper-immense-nightingale-374.mypinata.cloud/ipfs/";

export const fetchJSONByCID = async ({ id, table, expand }) => {
  if (!id || !table) {
    throw new Error("Error fetch datas: Missing pocketbase config");
  }
  try {
    const record = await clientPocket.records.getOne(table, id, {
      expand,
    });

    return record;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet JSON :", error);
    return null;
  }
};

export let createURICv = async (form) => {
  let id =
    form?.id > 0
      ? form?.id
      : parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]));

  let images = [];

  if (form?.cvImg) {
    images.push({ target: "cvImg", image: form?.cvImg, attributes: true });
  }
  if (form?.banniere) {
    images.push({
      target: "banniere",
      image: form?.banniere,
      attributes: true,
    });
  }
  if (form?.image) {
    images.push({ target: "image", image: form?.image });
  }

  let metadatas = {
    username: form.username,
    description: form.description,
    attributes: [
      {
        visibility: form.visibility,
        banniere: form.banniere,
        identity: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          dateOfBirth: form.dateOfBirth,
          citizen: form.citizen,
        },
        social: {
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
          facebook: form.facebook,
        },
        languages: form.languges,
        skills: form.skills,
        domain: form.domain,
        gallery: [],
      },
    ],
  };

  if (form?.cvImg)
    return await createURI({ id, title: "CV", images, metadatas });
};

export let createURIPub = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["pubsHub"]])) + 1;
  let images = [];
  if (form?.image) {
    images.push({ target: "image", image: form.image });
  }
  if (!form?.file && form?.payable && !form?.preview) {
    throw new Error("Missing file or preview");
  }
  if (form?.payable) {
    images.push({ target: "preview", attributes: true, image: form?.preview });
  }

  let uri = await createURI({
    id,
    title: "Pub",
    images,
    metadatas: {
      description: form.description,
      title: form?.title,
      attributes: [
        {
          owner: form?.owner,
          missionID: form?.missionID,

          answerID: form?.answerID,
          language: form?.language,
          tags: form?.tags,
          code: form?.code,
        },
      ],
    },
  });
  let uriPayable;
  if (form?.payable) {
    uriPayable = await createURI({
      id,
      title: "Payable pub",
      images: [{ target: "file", image: form?.file }],
      metadatas: { attributes: [{ pubID: id }] },
    });
  }
  return { uri, uriPayable };
};

export let createURIFeature = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["featuresHub"]])) + 1;
  let images = [];
  if (form?.image) {
    images.push({ target: "image", image: form.image });
  }
  let uri = await createURI({
    id,
    title: "Feature",
    images,
    metadatas: {
      description: form.description,
      title: form.title,
      attributes: [
        {
          domain: form.domain,
          experience: form.experience,
        },
      ],
    },
  });
  return uri;
};

export let createURILaunchpad = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])) + 1;

  let metadatas = {
    title: form?.title,
    description: form?.description,
    attributes: [
      {
        domain: form?.domain,
      },
    ],
  };

  let launchpadURI = await createURI({
    id,
    title: "Launchpad Datas",
    metadatas,
  });

  let images = [];

  if (form?.image) {
    images.push({ image: form?.image, target: "image" });
  }
  if (form?.banniere) {
    images.push({
      image: form?.banniere,
      target: "banniere",
      attributes: true,
    });
  }

  metadatas = {
    title: `Profile ${form?.title}`,
    description: form?.bio,
    attributes: [
      {
        facebook: form?.facebook,
        github: form?.github,
        linkedin: form?.linkedin,
        twitter: form?.twitter,
      },
    ],
  };
  let tokenURI = await createURI({
    id,
    title: "Launchpad Profile",
    metadatas: metadatas,
    images,
  });

  return { launchpadURI, tokenURI };
};
