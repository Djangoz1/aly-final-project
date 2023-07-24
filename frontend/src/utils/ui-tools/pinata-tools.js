import {
  _getterFeaturesHub,
  _getterMissionsHub,
  _getterPubsHub,
} from "./web3-tools";

const axios = require("axios");
require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

export const pinataGateway =
  "https://copper-immense-nightingale-374.mypinata.cloud/ipfs/";
export const fetchJSONByCID = async (CID) => {
  try {
    const response = await axios.get(
      `https://copper-immense-nightingale-374.mypinata.cloud/ipfs/${CID}`
    );

    if (response.data.name) {
      return response.data;
    } else {
      return JSON.parse(response.data);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet JSON :", error);
    return null;
  }
};

export const createImageCIDOnPinata = async (file, pinataMetadata) => {
  const imageData = new FormData();
  imageData.append("file", file);
  imageData.append("pinataMetadata", JSON.stringify(pinataMetadata));

  try {
    const responseImg = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",

      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // "x-api-key": "g9qfkj50yoSr8q3040vu6N5XgCsdVr7N",
          pinata_api_key: "f77b863f0d06b51f0c63",
          pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
        },
      }
    );

    const imageCID = responseImg.data.IpfsHash;
    return imageCID;
  } catch (error) {
    console.log({ error });
  }
};

export const createPubOnPinata = async (datas) => {
  try {
    const attributes = [
      {
        id: parseInt(await _getterPubsHub("getTokensLength")) + 1,
      },
    ];
    const pinataMetadata = {
      name: "Work3 - Publication" + attributes?.[0].id,
    };
    const pinataOptions = {
      cidVersion: 0,
    };
    let imageCID;
    if (datas.image) {
      imageCID = await createImageCIDOnPinata(datas.image, pinataMetadata);
    }

    const jsonData = {
      image: imageCID,
      title: datas.title,
      name: `Publication # ${attributes?.[0].id}`,
      description: datas.description,
      attributes: attributes,
    };
    console.log("jsoonb", jsonData);

    const formData = new FormData();
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
    formData.append("pinataOptions", JSON.stringify(pinataOptions));
    formData.append("pinataContent", JSON.stringify(jsonData));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: "f77b863f0d06b51f0c63",
          pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "Erreur lors de la création du fichier sur Pinata:",
      error.response.data
    );
  }
};

export const createMissionOnPinata = async (datas) => {
  try {
    const attributes = [
      {
        id: parseInt(await _getterMissionsHub("getTokensLength")) + 1,
        referenceMission: datas?.reference,
      },
    ];
    const pinataMetadata = {
      name: "Work3 - Mission" + attributes?.[0].id,
    };
    const pinataOptions = {
      cidVersion: 0,
    };
    let imageCID;
    if (datas.image) {
      imageCID = await createImageCIDOnPinata(datas.image, pinataMetadata);
    }

    const jsonData = {
      image: imageCID,
      url: datas.url,
      name: `Mission # ${attributes?.[0].id}`,
      description: datas.title,
      attributes: attributes,
    };

    const formData = new FormData();
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
    formData.append("pinataOptions", JSON.stringify(pinataOptions));
    formData.append("pinataContent", JSON.stringify(jsonData));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: "f77b863f0d06b51f0c63",
          pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "Erreur lors de la création du fichier sur Pinata:",
      error.response.data
    );
  }
};
export const createFeatureOnPinata = async (datas) => {
  try {
    const attributes = [
      {
        id: parseInt(await _getterFeaturesHub("getTokensLength")) + 1,
        devLanguage: datas?.devLanguage,
        domain: datas?.domain,
      },
    ];
    const pinataMetadata = {
      name: "Work3 - Feature" + attributes?.[0].id,
    };
    const pinataOptions = {
      cidVersion: 0,
    };
    let imageCID;
    if (datas.image && datas.image !== "") {
      imageCID = await createImageCIDOnPinata(datas.image, pinataMetadata);
    }

    const jsonData = {
      image: imageCID,
      url: datas.url,
      title: datas.title,
      name: `Feature # ${attributes?.[0].id}`,
      description: datas.description,
      attributes: attributes,
    };

    const formData = new FormData();
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
    formData.append("pinataOptions", JSON.stringify(pinataOptions));
    formData.append("pinataContent", JSON.stringify(jsonData));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: "f77b863f0d06b51f0c63",
          pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "Erreur lors de la création du fichier sur Pinata:",
      error.response.data
    );
  }
};
