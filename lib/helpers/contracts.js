const ethers = require("ethers");
const yaml = require("yaml");
const fs = require("fs");
/**
 * Returns ethers.js instances of the contracts mentioned in the root config.yaml file
 * @param {object} provider | ethers.js provider
 * @returns {map} addressToContract Map
 */
const getContracts = (provider) => {
  // Parse the config file
  const {
    config: { contracts },
  } = yaml.parse(fs.readFileSync("./config.yaml", "utf8"));

  const monitorContracts = new Map();

  // For each contract in the config, instantiate the ethers.js object
  contracts.forEach((contract) => {
    const abi = JSON.parse(fs.readFileSync(contract.pathToArtifact));
    monitorContracts.set(contract.name, {
      contract: new ethers.Contract(contract.address, abi, provider),
      eventEmitted: contract.eventEmitted,
      timestampVariable: contract.timestampVariable,
    });
  });

  return monitorContracts;
};

module.exports = getContracts;
