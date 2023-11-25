require("dotenv").config();
let addresses = require("../addresses.json");

const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(key, secret);
const axios = require("axios");
const fs = require("fs");
const { getContractAt } = require("../helpers/test_init");
const {
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  PUB_DATAS_URI_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_URI_EXEMPLE,
} = require("../helpers/test_utils");

require("cross-fetch/polyfill");
const PocketBase = require("pocketbase/cjs");

const pocketClient = new PocketBase("http://127.0.0.1:8090");

const getAllPinnedFiles = async () => {
  let allPinnedFiles = [];
  let page = 1;

  // while (page !== 50) {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?pageLimit=10&page=${page}`,
      {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      }
    );

    const { rows } = response.data;
    // if (rows.length === 0) {
    //   break; // Aucun résultat supplémentaire, donc nous avons récupéré tous les fichiers
    // }

    allPinnedFiles = allPinnedFiles.concat(rows);
    console.log(
      rows.length +
        " add on queue deleter on " +
        allPinnedFiles.length +
        " total"
    );
    page++;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des fichiers épinglés :",
      error.message
    );
    throw error;
  }
  // }

  return allPinnedFiles;
};

const deletePinnedFile = async (fileHash) => {
  try {
    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${fileHash}`, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });
    console.log(
      `Fichier épinglé avec le hash ${fileHash} supprimé avec succès.`
    );
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du fichier épinglé avec le hash ${fileHash} :`,
      error.message
    );
  }
};

const deleteAllPinnedFiles = async () => {
  try {
    const pinnedFiles = await getAllPinnedFiles();

    if (pinnedFiles.length === 0) {
      console.log("Aucun fichier épinglé trouvé.");
      return;
    }

    console.log(
      `Suppression de ${pinnedFiles.length} fichiers épinglés en cours...`
    );

    for (const file of pinnedFiles) {
      await deletePinnedFile(file.ipfs_pin_hash);
    }

    console.log("Tous les fichiers épinglés ont été supprimés.");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la suppression des fichiers épinglés :",
      error.message
    );
  }
};

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

const createURIFeature = async ({ title, description, missionID }) => {
  let moock = { ...FEATURE_DATAS_URI_EXEMPLE };
  if (!missionID) {
    throw new Error("Missing missionID feature value");
  }
  moock.missionID = missionID;
  if (title) {
    moock.title = title;
  }
  if (description) {
    moock.description = description;
  }
  try {
    let uri = await createURI({ table: "features", metadatas: moock });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};
const createURIPub = async ({ userID, description, img, title }) => {
  let moock = PUB_DATAS_URI_EXEMPLE;
  if (!userID) {
    throw new Error("Missing owner pub value");
  }

  moock.userID = userID;
  if (description) {
    moock.description = description;
  }
  if (img) {
    moock.image = img;
  }
  if (title) {
    moock.title = title;
  }

  try {
    let uri = await createURI({ table: "posts", metadatas: moock });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

let createURI = async ({ table, metadatas }) => {
  if (!table?.length > 0) {
    throw new Error("Missing table collection");
  }
  const record = await pocketClient.records.create(table, metadatas);
  return record.id;
};

const createURILaunchpad = async ({ userID }) => {
  let moock = LAUNCHPAD_DATAS_URI_EXEMPLE;
  if (!userID) {
    throw new Error("Missing launchpad user value");
  }
  moock.userID = userID;

  let launchpadURI = await createURI({
    table: "launchpads",
    metadatas: moock,
  });

  return { launchpadURI, tokenURI: launchpadURI }; //! TO delete useless uri
};

let createURICV = async ({ name, description, image }) => {
  let moock = CV_DATAS_URI_EXEMPLE;

  if (name) {
    moock.username = name;
  }
  if (description) {
    moock.description = description;
  }
  if (image) {
    moock.image = image;
  }

  try {
    let uri = await createURI({
      table: "accounts",
      metadatas: moock,
    });
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

const createURIMission = async ({ title, description, userID, image }) => {
  if (!userID) {
    throw new Error("Missing mission owner value");
  }
  let moock = { ...MISSION_DATAS_URI_EXEMPLE };
  moock.userID = userID;
  if (title) {
    moock.title = title;
  }
  if (description) {
    moock.description = description;
  }
  if (image) {
    // moock.image = image;
  }

  try {
    let uri = await createURI({ table: "missions", metadatas: moock });
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
  createURI,
  getAllPinnedFiles,
  createURIMission,
  createURICV,
  createURILaunchpad,
  deletePinnedFile,
  deleteAllPinnedFiles,
  pocketClient,
};
