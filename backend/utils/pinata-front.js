require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(key, secret);

const fetchJSONByCID = async (CID) => {
  try {
    const pinataResponse = await pinata.pinByHash(CID);
    const pinataData = await pinataResponse.json();
    return pinataData;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet JSON :", error);
    return null;
  }
};
