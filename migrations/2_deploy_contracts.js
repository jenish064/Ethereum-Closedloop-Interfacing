const DataRW = artifacts.require("DataRW");

module.exports = function(deployer) {
  deployer.deploy(DataRW);
};