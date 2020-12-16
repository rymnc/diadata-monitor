const getUnixTime = () => Math.floor(Date.now() / 1000.0);

const hexToUnixTime = (hexTime) => parseInt(hexTime._hex, 16);

const toISOTime = (unixTime) => new Date(unixTime * 1000).toISOString();

const arrayToISOTime = (...args) => args.map((arg) => toISOTime(arg));

module.exports = {
  getUnixTime,
  hexToUnixTime,
  toISOTime,
  arrayToISOTime,
};
