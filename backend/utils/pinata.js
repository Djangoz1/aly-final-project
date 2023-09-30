require("dotenv").config();
let addresses = require("../addresses.json");

const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(key, secret);

const fs = require("fs");
const { getContractAt } = require("../helpers/test_init");
const {
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  PUB_DATAS_URI_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_URI_EXEMPLE,
} = require("../helpers/test_utils");

const createImageCIDOnPinata = async (image, pinataMetadata) => {
  const readableStreamForFile = fs.createReadStream(image);

  const options = {
    pinataMetadata,
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    return result.IpfsHash;
  } catch (error) {
    console.log({ error });
  }
};

const createURIWorkerProposal = async ({ id, title, description, url }) => {
  const readableStreamForFile = fs.createReadStream("img/contract.png");

  if (!id && !title && !description) {
    throw new Error("Missing value on creation worker proposal URI");
    return;
  }
  const options = {
    pinataMetadata: {
      name: `Work3 - Work Proposal${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    const body = {
      title: title,
      description: description,
      url: url,
      image: result.IpfsHash,
      name: "Work Proposal #" + id,
    };

    const json = await pinata.pinJSONToIPFS(body, options);

    return json;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

const createURIFeature = async ({
  id,
  title,
  description,
  attributes,
  image,
}) => {
  let moock = FEATURE_DATAS_URI_EXEMPLE;

  try {
    let images = [];
    if (image) {
      images.push({ img: image });
    }
    const metadatas = {
      title: title || moock?.title,
      description: description || moock?.description,
      attributes: [attributes || moock?.attributes],
    };
    let uri = await createURI({ id, title: "Feature", images, metadatas });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};
const createURIPub = async ({
  id,
  description,
  img,
  answerID,
  missionID,
  owner,
}) => {
  let moock = PUB_DATAS_URI_EXEMPLE;

  let metadatas = {
    description: description || moock.description,
    attributes: [moock.attributes],
  };
  let images = [];
  metadatas.attributes[0].missionID = missionID;
  metadatas.attributes[0].answerID = answerID;
  metadatas.attributes[0].owner = owner;

  if (img) {
    images.push({ img, target: "image" });
  }

  try {
    let uri = await createURI({ id, title: "Pub", images, metadatas });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

let createURI = async ({ id, title, images, metadatas, moock }) => {
  const pinataMetadata = {
    name: "Work3 - " + title + "#" + id,
  };
  const pinataOptions = {
    cidVersion: 0,
  };

  for (let index = 0; index < images?.length; index++) {
    const element = images[index];

    if (element?.img) {
      let uri = await createImageCIDOnPinata(element?.img, {
        name: "Work3 - Img " + element?.target + title + "#" + id,
      });
      let target = "image";

      if (element?.target) {
        target = element.target;
      }
      if (element?.attributes) {
        metadatas.attributes[0][target] = uri;
      } else {
        metadatas[target] = uri;
      }
    }
  }

  const _options = {
    pinataMetadata,
    pinataOptions,
  };

  metadatas.name = pinataMetadata.name;
  metadatas.attributes[0].createdAt = Date.now();
  const json = await pinata.pinJSONToIPFS(metadatas, _options);

  return json.IpfsHash;
};

const createURILaunchpad = async ({ id, metadatas }) => {
  let moock = LAUNCHPAD_DATAS_URI_EXEMPLE;
  let _metadatas = {
    title: metadatas?.title || moock?.title,
    description: metadatas?.description || moock?.description,
    attributes: [
      {
        domain: metadatas?.domain || moock?.attributes?.domain,
      },
    ],
  };

  let launchpadURI = await createURI({
    id,
    title: "Launchpad Datas",
    metadatas: _metadatas,
    moock,
  });
  let images = [
    { img: metadatas?.image || moock?.image, target: "image" },
    {
      img: metadatas?.banniere || moock?.banniere,
      target: "banniere",
      attributes: true,
    },
  ];

  _metadatas = {
    title: `Profile ${metadatas?.title || moock?.title}`,
    description: metadatas?.bio || null,
    attributes: [
      {
        facebook: metadatas?.facebook || null,
        github: metadatas?.github || null,
        linkedin: metadatas?.linkedin || null,
        twitter: metadatas?.twitter || null,
      },
    ],
  };
  let tokenURI = await createURI({
    id,
    title: "Launchpad Profile",
    metadatas: _metadatas,
    images,
    moock,
  });

  return { launchpadURI, tokenURI };
};

let createURICV = async ({ id, name, description, attributes, image }) => {
  let moock = CV_DATAS_URI_EXEMPLE;

  let _metadatas = {
    username: name || moock?.username,
    description: description || moock?.description,
    attributes: attributes || moock?.attributes,
  };

  let images = [];

  images.push({
    img: attributes?.[0]?.cvImg || moock.cv,
    target: "cvImg",
    attributes: true,
  });
  images.push({
    img: attributes?.[0]?.banniere || moock.banniere,
    target: "banniere",
    attributes: true,
  });
  images.push({ img: image || moock?.image, target: "image" });

  try {
    let uri = await createURI({
      id,
      title: "CV",
      metadatas: _metadatas,
      images,
    });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

const createURIMission = async ({
  id,
  title,
  description,
  attributes,
  image,
}) => {
  let moock = MISSION_DATAS_URI_EXEMPLE;

  let images = [
    { img: image || moock?.image },
    {
      img: attributes?.banniere || moock.attributes.banniere,
      target: "banniere",
      attributes: true,
    },
  ];
  const metadatas = {
    title: title || moock.title,
    description: description || moock.description,
    attributes: attributes || [moock.attributes],
  };

  try {
    let uri = await createURI({ id, title: "Mission", images, metadatas });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

module.exports = {
  createURIWorkerProposal,
  createURIFeature,
  createURIPub,
  createURIMission,
  createURICV,
  createURILaunchpad,
};
