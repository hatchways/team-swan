let obj = {};
class Cache {
  static setSocketObj = (id, object) => {
    obj[id] = object;
  };
  static getSocketObj = (id) => obj[id];
  static deleteSocketObj = (id) => delete obj[id];
  static clearObj = () => {
    obj = {};
  };
}
module.exports = Cache;
