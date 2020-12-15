const ethers = require("ethers");
const getContracts = require("./helpers/contracts");
const getConfig = require("./helpers/getConfig");
const { getUnixTime } = require("./helpers/utils");
const {
  config: { pollRate, providerUrl, providerType, livenessRate },
} = getConfig();

const provider = new ethers.providers[providerType](providerUrl);

const contractMap = getContracts(provider);

const poller = async () => {
  const blockNumber = await provider.getBlockNumber();
  for (contract of contractMap.values()) {
    const fromBlock = blockNumber - 10;
    const toBlock = "latest";
    const currentTime = getUnixTime();
    const log = (
      await contract.contract.queryFilter(
        contract.contract.filters[contract.eventEmitted](),
        fromBlock,
        toBlock
      )
    )[0];
    if (
      log !== undefined &&
      log[contract.timestampVariable] < currentTime &&
      log[contract.timestampVariable] > currentTime - livenessRate
    ) {
      console.log('all good')
    } else {
      console.log('error')
    }
  }
};

setInterval(poller, pollRate * 1000);
