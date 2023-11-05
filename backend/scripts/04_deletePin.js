require("dotenv").config();
let addresses = require("../addresses.json");

const key = process.env.PINATA_KEY;

const { pocketClient } = require("../utils/pinata");
const secret = process.env.PINATA_SECRET;

const deleter = async () => {
  let table = "accounts";
  let queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "features";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "missions";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "launchpads";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "escrows";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "posts";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "likes";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "follows";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "evaluations";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }
  table = "missions";
  queue = await pocketClient.records.getFullList(table, 200);
  console.log(queue?.length, " ", table, " to delete");
  for (let index = 0; index < queue.length; index++) {
    const element = queue[index];
    await pocketClient.records.delete(table, element?.id);
    console.log(table, "  delete success");
  }

  console.log("Success delete. Queue deleter is empty");
};

module.exports = { deleter };
