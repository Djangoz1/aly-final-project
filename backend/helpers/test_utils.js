const { ethers } = require("hardhat");
const _testParseHex = (number) => {
  console.log("number", number);

  return number && ethers.BigNumber.from(number).toNumber();
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const PUB_DATAS_EXEMPLE = {
  title: "Title of my post",
  content:
    "This is a part where content value stored. I can write everything I want to share at the community or missions community or private community.",
  imgURI: "https://picsum.photos/id/100/200",
  publisher: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  followers: 0,
};
const FEATURE_DATAS_EXEMPLE = {
  title: "Title of my feature",
  content:
    "This is a part where content value stored. I can write everything I want to describe my feature. Once a worker join this feature, I must follow instruction of this content. In the end, if a litigation arrived between owner(me) and worker, this content will be shared on Kleros Court",
  imgURI: "https://picsum.photos/id/100/200",
  assignedWorker: ZERO_ADDRESS,
  devLanguage: "solidity",
  wadge: 200,
};

module.exports = {
  _testParseHex,
  ZERO_ADDRESS,
  PUB_DATAS_EXEMPLE,
  FEATURE_DATAS_EXEMPLE,
};
