const { readSync, CASELESS_SORT } = require('readdir');
const path = require('path');

module.exports = function(resolversPath, { permissionsDiscriminator = /^(\w+)\./, defaultPermission = 'all' } = {}) {
  const resolvers = new Map();
  readSync(resolversPath, ['**.js'], CASELESS_SORT)
    .forEach((fileName) => {
      const extractedPermission= permissionsDiscriminator.exec(fileName);
      const permission = extractedPermission ? extractedPermission[1] : defaultPermission;
      resolvers.set(permission, require(path.join(resolversPath, fileName)))
    });
  return resolvers;
};
