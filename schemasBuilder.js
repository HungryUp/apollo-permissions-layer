const { readSync, CASELESS_SORT } = require('readdir');
const path = require('path');
const fs = require('fs');

module.exports = function(schemasPath, { permissionsDiscriminator = /^(\w+)\./, defaultPermission = 'all' } = {}) {
  const schemas = new Map();
  readSync(schemasPath, ['**.graphqls'], CASELESS_SORT)
    .forEach((fileName) => {
      const extractedPermission= permissionsDiscriminator.exec(fileName);
      const permission = extractedPermission ? extractedPermission[1] : defaultPermission;
      schemas.set(permission, fs.readFileSync(path.join(schemasPath, fileName)).toString());
    });
  return schemas;
};