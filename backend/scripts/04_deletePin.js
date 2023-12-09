require("dotenv").config();
let addresses = require("../addresses.json");

const key = process.env.PINATA_KEY;

const { pocketClient } = require("../utils/pinata");
const secret = process.env.PINATA_SECRET;

const deleter = async () => {
  let tables = [
    "evaluations",
    "feedbacks",
    "messages",
    "likes",
    "follows",
    "follows_missions",
    "payable_posts",
    "posts",
    "toDo",
    "missions",

    "launchpads",
    "features",
    "cvs",
    "accounts",
  ];
  for (let index = 0; index < tables.length; index++) {
    const table = tables[index];
    let queue = await pocketClient.records.getFullList(table, 200);
    console.log(queue?.length, " ", table, " to delete");
    for (let index = 0; index < queue.length; index++) {
      const element = queue[index];
      await pocketClient.records.delete(table, element?.id);
      console.log(table, "  delete success");
    }
  }

  console.log("Success delete. Queue deleter is empty");
};

module.exports = { deleter };
