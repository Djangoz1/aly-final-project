const _testParseHex = (number) => {
  return number && ethers.BigNumber.from(number._hex).toNumber();
};

module.exports = { _testParseHex };
