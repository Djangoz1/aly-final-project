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
} = require("../helpers/test_utils");

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
    console.log("ERROR", err);
    return null;
  }
};

const createURIFeature = async ({ id, title, description, attributes }) => {
  const readableStreamForFile = fs.createReadStream("img/contract.png");
  let moock = FEATURE_DATAS_URI_EXEMPLE;
  if (!id && !title && !description) {
    throw new Error("Missing value on creation feature URI");
    return;
  }
  const options = {
    pinataMetadata: {
      name: `Work3 - Feature${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    const body = {
      title: title || moock?.title,
      description: description || moock?.description,
      url: `profile/feature/${id}`,
      image: result.IpfsHash || moock?.image,
      name: "Feature #" + id,
      attributes: [attributes || moock?.attributes],
    };

    const json = await pinata.pinJSONToIPFS(body, options);
    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};
const createURIPub = async ({ id, title, description }) => {
  let moock = PUB_DATAS_URI_EXEMPLE;
  const readableStreamForFile = fs.createReadStream(moock.image);
  if (!id && !title && !description) {
    throw new Error("Missing value on creation Publication URI");
  }
  const options = {
    pinataMetadata: {
      name: `Work3 - Publication${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    const body = {
      title: title || moock.title,
      description: description || moock?.description,
      url: "/community/pub/" + id,
      image: result.IpfsHash,
      name: "Publication #" + id,
      attributes: moock.attributes,
    };

    const json = await pinata.pinJSONToIPFS(body, options);
    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};

let createURICV = async ({ id, name, description, attributes, image }) => {
  let moock = CV_DATAS_URI_EXEMPLE;

  let cv = fs.createReadStream(attributes?.[0]?.cvImg || moock.cv);
  const readableStreamForFile = fs.createReadStream(image || moock.image);
  if (!id && !title && !description) {
    throw new Error("Missing value on creation CV URI");
  }

  const options = {
    pinataMetadata: {
      name: `Work3 - #cv${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  const _options = {
    pinataMetadata: {
      name: `Work3 - #cv img${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    const cvResult = await pinata.pinFileToIPFS(cv, _options);
    let _attributes = attributes || moock.attributes;
    _attributes[0].cvImg = cvResult.IpfsHash;
    const body = {
      title: "Work3",
      username: name || moock.username,
      description: description || moock.description,
      url: `/profile/cv/${id}`,
      attributes: _attributes,
      image: result.IpfsHash,
      name: "CV #" + id,
    };

    const json = await pinata.pinJSONToIPFS(body, options);

    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};

const createURIMission = async ({ id, title, description, attributes }) => {
  let moock = MISSION_DATAS_URI_EXEMPLE;
  const readableStreamForFile = fs.createReadStream(moock.image);

  if (!id && !title && !description) {
    throw new Error("Missing value on creation Mission URI");
    return;
  }
  const options = {
    pinataMetadata: {
      name: `Work3 - Mission${id}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    const body = {
      title: title || moock.title,
      description: description || moock.description,
      url: `/profile/mission/${id}`,
      attributes: attributes || [moock.attributes],
      image: result.IpfsHash || moock.image,
      name: "Mission #" + id,
    };

    const json = await pinata.pinJSONToIPFS(body, options);
    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};

module.exports = {
  createURIWorkerProposal,
  createURIFeature,
  createURIPub,
  createURIMission,
  createURICV,
};
