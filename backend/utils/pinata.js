require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const {
  MISSION_DATAS_URI_EXEMPLE,
  FEATURE_DATAS_URI_EXEMPLE,
  PUB_DATAS_URI_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
  LAUNCHPAD_DATAS_URI_EXEMPLE,
} = require("../helpers/test_utils");
const FormData = require("form-data");
const path = require("path");

require("cross-fetch/polyfill");
const PocketBase = require("pocketbase/cjs");
const pocketURL = "http://127.0.0.1:8090";
const pocketClient = new PocketBase(pocketURL);

const createImage = async ({ url, _path, _table, _target, metadatas }) => {
  const imagePath = path.resolve(__dirname, "..", "img", _path || "docs", url);

  const fileStream = fs.createReadStream(imagePath);
  let formData = new FormData();
  formData.append(_target || "image", fileStream);

  for (const key in metadatas) {
    if (metadatas.hasOwnProperty(key)) {
      formData.append(key, metadatas[key]);
    }
  }

  try {
    const { data } = await axios.post(
      `${pocketURL}/api/collections/${_table || "gallery"}/records`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    return data.id;
  } catch (error) {
    console.error(
      "Erreur :",
      error.response ? error.response.data : error.message
    );
  }
};

const createURIFeature = async ({
  title,
  abstract,
  skills,
  description,
  domain,
  missionID,
}) => {
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
  if (domain) {
    moock.domain = domain;
  }
  if (skills) {
    moock.skills = skills;
  }
  if (abstract) {
    moock.abstract = abstract;
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

let createURICV = async ({ username, description, avatar }) => {
  let moock = { ...CV_DATAS_URI_EXEMPLE };

  if (username) {
    moock.username = username;
  }
  if (description) {
    moock.description = description;
  }

  try {
    let uri;
    if (avatar) {
      uri = await createImage({
        _table: "accounts",
        metadatas: moock,
        url: avatar,
        _target: "avatar",
        _path: "profile",
      });
    } else {
      uri = await createURI({
        table: "accounts",
        metadatas: moock,
      });
    }
    return uri;
  } catch (err) {
    console.error("ERROR", err);
    return null;
  }
};

const createURIMission = async ({ title, description, image }) => {
  let moock = { ...MISSION_DATAS_URI_EXEMPLE };

  if (title) {
    moock.title = title;
  }
  if (description) {
    moock.description = description;
  }
  if (image) {
    moock.image = image;
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
  createURIFeature,
  createURIPub,
  createURI,

  createURIMission,
  createURICV,
  createImage,
  createURILaunchpad,

  pocketClient,
};
