require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(key, secret);
const fs = require("fs");

const createURIWorkerProposal = async ({ id, title, description, url }) => {
  const readableStreamForFile = fs.createReadStream("img/contract.png");

  if (!id && !title && !description) {
    throw new Error("Missing value on creation worker proposal URI");
    return;
  }
  const options = {
    pinataMetadata: {
      name: `Work3 - Post${id}`,
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
      name: "Post #" + id,
    };

    const json = await pinata.pinJSONToIPFS(body, options);

    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};

const createURIFeature = async ({ id, title, description, url }) => {
  const readableStreamForFile = fs.createReadStream("img/contract.png");

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
      title: title,
      description: description,
      url: url,
      image: result.IpfsHash,
      name: "Feature #" + id,
    };

    const json = await pinata.pinJSONToIPFS(body, options);
    return json;
  } catch (err) {
    console.log("ERROR", err);
    return null;
  }
};

const createURIMission = async ({ id, title, description, url }) => {
  const readableStreamForFile = fs.createReadStream("img/contract.png");

  if (!id && !title && !description) {
    throw new Error("Missing value on creation feature URI");
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
      title: title,
      description: description,
      url: url,
      image: result.IpfsHash,
      name: "Feature #" + id,
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
  createURIMission,
};
