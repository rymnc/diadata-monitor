const ethers = require("ethers");
const yaml = require("yaml");

/* Returns ethers.js instances of the contracts mentioned in the root config.yaml file
* @param {string} providerUrl | http endpoint to an ethereum node
* @returns {map} addressToContract Map
*/
const getContracts = (providerUrl) => {
  // Parse the config file
  const { config: {contracts} } = yaml.parse(
    fs.readFileSync("./config.yaml", "utf8")
  );
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const monitorContracts = new Map();
  contracts.forEach((contract) => {
    const abi = JSON.parse(fs.readFileSync(contract.pathToArtifact));
    monitorContracts.set(
      contract.name,
      new ethers.Contract(contract.address, abi, provider)
    );
  });

  return monitorContracts;
}

module.exports = (providerUrl) => {
  
};
