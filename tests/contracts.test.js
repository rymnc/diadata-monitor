const { expect } = require("chai");
const getContracts = require("../lib/helpers/contracts");
const yaml = require("yaml");
const fs = require('fs')
const {config} = yaml.parse(fs.readFileSync("./config.yaml", "utf8"));

describe("[ContractFetcher]", () => {
  it("Should fetch the contracts", () => {
    const answer = getContracts(
      "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213"
    );
    config.contracts.forEach((contract) => {
      expect(answer.get(contract.name)).to.not.eql(undefined);
    });
  });
});
