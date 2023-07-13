const axios = require("axios");
require("dotenv").config();

export const fetchJSONByCID = async (CID) => {
  try {
    const response = await axios.get(
      `https://copper-immense-nightingale-374.mypinata.cloud/ipfs/${CID}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet JSON :", error);
    return null;
  }
};
