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

/**
* Main Runner Function that is executed at every n second interval defined in the "pollRate" config var
*/
const poller = async () => {
  // Iterates through the contracts defined in the "contracts" config var
  for (contract of contractMap.values()) {
    // Gets the UNIX time to Verify
    const currentTime = getUnixTime();
    // Gets block from timestamp via Etherscan
    const fromBlock = await getBlockFromTimestamp(currentTime - livenessRate);
    const toBlock = "latest";

    // Fetches the logs from the ethereum node 
    const fetchedLogs = await contract.contract.queryFilter(
      contract.contract.filters[contract.eventEmitted](),
      fromBlock,
      toBlock
    );

    // Sanity check. If this fails it means that there have been no events for the past x seconds
    // x is defined as "livenessRate" in the config
    if (fetchedLogs !== undefined) {
      // Get the latest log
      const log = fetchedLogs.pop();

      // Gets the timestamp from the event, and parses. Defined as "timestampVariable" in the contract config
      const fetchedTimestamp = hexToUnixTime(
        log.args[contract.timestampVariable]
      );

      // Checks if the fetchedTimestamp passes the tests
      if (
        fetchedTimestamp < currentTime &&
        fetchedTimestamp > currentTime - livenessRate
      ) {
        // Everything is fine here!
        console.log("all good");
      } else {
        // email reason: the contracts event timestamp fails the checks
      }
    } else {
      // email reason: contract has not emitted events in the past x seconds
    }
  }
};

// Executes the runner function every "pollRate" seconds
setInterval(poller, pollRate * 1000);
