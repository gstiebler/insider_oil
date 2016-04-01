var promise_bb = require("bluebird");

const params = [];

params.push( "ALTER TABLE `wells`" +
  " ADD COLUMN `drilling_rig_onshore_id`INTEGER DEFAULT NULL" +
  ", ADD FOREIGN KEY (`drilling_rig_onshore_id`) REFERENCES `drilling_rigs_onshore` (`id`)" +
  " ON UPDATE CASCADE ON DELETE RESTRICT" );


params.push( "ALTER TABLE `wells`" +
  " ADD COLUMN `drilling_rig_offshore_id`INTEGER DEFAULT NULL" +
  ", ADD FOREIGN KEY (`drilling_rig_offshore_id`) REFERENCES `drilling_rigs_offshore` (`id`)" +
  " ON UPDATE CASCADE ON DELETE RESTRICT" );


module.exports = {
    up: function(queryInterface, Sequelize) {
        return promise_bb.each(params, function(item) {
            return queryInterface.sequelize.query(item);
        });
    },

    down: function(queryInterface) {
		return false;
    }
};
