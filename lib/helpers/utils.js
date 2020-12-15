const getUnixTime = () => Math.floor(Date.now() / 1000.0);

const hexToUnixTime = (hexTime) => parseInt(hexTime._hex, 16);

module.exports = {
  getUnixTime,
  hexToUnixTime,
};
