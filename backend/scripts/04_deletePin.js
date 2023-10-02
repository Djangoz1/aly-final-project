require("dotenv").config();
let addresses = require("../addresses.json");

const key = process.env.PINATA_KEY;
const axios = require("axios");
const secret = process.env.PINATA_SECRET;

const PIN_QUERY =
  "https://api.pinata.cloud/data/pinList?status=pinned&includesCount=false&pageLimit=1000";

let pinHashes = [];

const deletePinFromIPFS = async (hashToUnpin) => {
  try {
    const res = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`,
      {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      }
    );

    console.log("Success delete ", hashToUnpin);
  } catch (error) {
    console.log("Error during delete", error.message);
  }
};
const wait = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const fetchPins = async () => {
  try {
    const res = await axios.get(PIN_QUERY, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });
    const responseData = res.data.rows;
    responseData.forEach((row) => {
      pinHashes.push(row.ipfs_pin_hash);
    });
    console.log(pinHashes.length, "On queue deleter");
  } catch (error) {
    console.log("Error fetch", error.message);
  }
};

const bulkUnpin = async () => {
  try {
    for (const hash of pinHashes) {
      await deletePinFromIPFS(hash);
      await wait(200);
    }
    pinHashes = [];
  } catch (error) {
    console.log("Error bulk", error.message);
  }
};

const deleter = async () => {
  await fetchPins();
  while (pinHashes.length !== 0) {
    await bulkUnpin();
    await fetchPins();
  }
  console.log("Success delete. Queue deleter is empty");
};

module.exports = { deleter };
