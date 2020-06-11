let obj = {};
class Cache {
  static setSocketObj = (id, object) => {
    obj[id] = object;
  };
  static getSocketObj = (id) => obj[id];
  static clearSocketObj = (id) => delete obj[id];
}
module.exports = Cache;
