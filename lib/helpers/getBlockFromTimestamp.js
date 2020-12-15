const axios = require("axios");
const getConfig = require("./getConfig");

const {
  config: { etherscanKey },
} = getConfig();

/**
 * Get the block number from the timestamp via Etherscan
 * @param {string} timestamp
 * @returns {string} blockNumber
 */
const getBlockFromTimestamp = async (timestamp) => {
  const block = await axios.get(
    "https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=" +
      timestamp +
      "&closest=before&apikey=" +
      etherscanKey
  );
  return Number(block.data.result);
};

module.exports = getBlockFromTimestamp;
