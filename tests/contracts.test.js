const { expect } = require("chai");
const ethers = require("ethers");
const getContracts = require("../lib/helpers/contracts");
const getConfig = require("../lib/helpers/getConfig");

const {
  config: { contracts, providerUrl, providerType },
} = getConfig();
describe("[ContractFetcher]", () => {
  it("Should fetch the contracts", () => {
    const provider = new ethers.providers[providerType](providerUrl);
    const answer = getContracts(provider);
    contracts.forEach((contract) => {
      expect(answer.get(contract.name)).to.not.eql(undefined);
    });
  });
});
