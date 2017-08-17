const { makeExecutableSchema } = require('graphql-tools');
const resolversBuilder = require('./resolversBuilder');
const schemasBuilder = require('./schemasBuilder');
const merge = require('lodash.merge');

module.exports = function ({
   schemasPath, resolversPath, schemasMap, resolversMap,
   permissionsDiscriminator = /^(\w+)\./, defaultPermission = 'all',
}) {
  schemasMap = schemasMap || schemasBuilder(schemasPath, { permissionsDiscriminator, defaultPermission });
  resolversMap = resolversMap || resolversBuilder(resolversPath, { permissionsDiscriminator, defaultPermission });

  return function(permissions) {
    const typeDefs = [...permissions]
      .map(p => schemasMap.get(p))
      .filter(f => !!f)
      .reduce((a, b) => a.concat(b), []);

    const resolvers = [...permissions]
      .map(p => resolversMap.get(p))
      .filter(f => !!f)
      .reduce((a, b) => merge(a, b), {});

    return makeExecutableSchema({ typeDefs, resolvers });
  };
};