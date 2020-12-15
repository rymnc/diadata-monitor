const ethers = require("ethers");
const getContracts = require("./helpers/contracts");
const getConfig = require("./helpers/getConfig");
const { getUnixTime, hexToUnixTime } = require("./helpers/utils");
const getBlockFromTimestamp = require("./helpers/getBlockFromTimestamp");
const {
  config: { pollRate, providerUrl, providerType, livenessRate },
} = getConfig();

const provider = new ethers.providers[providerType](providerUrl);

const contractMap = getContracts(provider);

const poller = async () => {
  const blockNumber = await provider.getBlockNumber();
  for (contract of contractMap.values()) {
    const currentTime = getUnixTime();
    const fromBlock = await getBlockFromTimestamp(currentTime - livenessRate);
    const toBlock = "latest";
    const fetchedLogs = await contract.contract.queryFilter(
      contract.contract.filters[contract.eventEmitted](),
      fromBlock,
      toBlock
    );
    if (fetchedLogs !== undefined) {
      const log = fetchedLogs.pop();
      const fetchedTimestamp = hexToUnixTime(
        log.args[contract.timestampVariable]
      );
      if (
        fetchedTimestamp < currentTime &&
        fetchedTimestamp > currentTime - livenessRate
      ) {
        console.log("all good");
      } else {
        // email
      }
    } else {
      // email
    }
  }
};

setInterval(poller, pollRate * 1000);
