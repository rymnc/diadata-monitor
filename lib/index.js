const ethers = require("ethers");
const getContracts = require("./helpers/contracts");
const getConfig = require("./helpers/getConfig");
const {
  getUnixTime,
  hexToUnixTime,
  arrayToISOTime,
} = require("./helpers/utils");
const getBlockFromTimestamp = require("./helpers/getBlockFromTimestamp");

const {
  config: { pollRate, providerUrl, providerType, livenessRate, notifiers },
} = getConfig();

const Notifier = require("./notifiers/notifier");
const logger = new Notifier(notifiers);

const provider = new ethers.providers[providerType](providerUrl);

const contractMap = getContracts(provider);

/**
 * Main Runner Function that is executed at every n second interval defined in the "pollRate" config var
 */
const poller = async () => {
  // Iterates through the contracts defined in the "contracts" config var
  for (contract of contractMap.values()) {
    // Basic Payload to error/success
    //console.log(contract)
    const payload = {
      contract: {
        name: contract.name,
        address: contract.address,
      },
    };

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
        payload.body =
          "Contract Has emitted events according to the timestamps given";
        await logger.success(payload);
      } else {
        // reason: the contracts event timestamp fails the checks
        const [isoFetch, isoCurrent, isoLiveness] = arrayToISOTime(
          fetchedTimestamp,
          currentTime,
          livenessRate
        );
        payload.type = "Contract Event Timestamp Check Failed";
        payload.body = `Fetched Timestamp: ${isoFetch}, Current Time: ${isoCurrent}, Liveness Rate: ${isoLiveness}`;
        await logger.error(payload);
      }
    } else {
      // reason: contract has not emitted events in the past x seconds
      const [isoLiveness] = arrayToISOTime(livenessRate);
      payload.type = "Contract Has not Emitted Events in the Liveness Rate";
      payload.body = `Liveness Rate: ${isoLiveness}`;
      await logger.error(payload);
    }
  }
};

// Executes the runner function every "pollRate" seconds
setInterval(poller, pollRate * 1000);
