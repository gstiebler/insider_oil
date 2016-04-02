import promise_bb = require("bluebird");

const queryParams = [];

queryParams.push( "ALTER TABLE `wells`" +
  " ADD COLUMN `drilling_rig_onshore_id`INTEGER DEFAULT NULL" +
  ", ADD FOREIGN KEY (`drilling_rig_onshore_id`) REFERENCES `drilling_rigs_onshore` (`id`)" +
  " ON UPDATE CASCADE ON DELETE RESTRICT" );


queryParams.push( "ALTER TABLE `wells`" +
  " ADD COLUMN `drilling_rig_offshore_id`INTEGER DEFAULT NULL" +
  ", ADD FOREIGN KEY (`drilling_rig_offshore_id`) REFERENCES `drilling_rigs_offshore` (`id`)" +
  " ON UPDATE CASCADE ON DELETE RESTRICT" );


module.exports = {
    up: function(queryInterface, Sequelize) {
        const columnParams = [];

		columnParams.push({
			columnName: 'name_operator',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'type',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'category',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'reclassification',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'situation',
			columnDesc: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'start',
			columnDesc: {
				type: Sequelize.DATEONLY,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'end',
			columnDesc: {
				type: Sequelize.DATEONLY,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'conclusion',
			columnDesc: {
				type: Sequelize.DATEONLY,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'measured_depth',
			columnDesc: {
				type: Sequelize.FLOAT,
				allowNull: true
			}
		});

		columnParams.push({
			columnName: 'depth',
			columnDesc: {
				type: Sequelize.FLOAT,
				allowNull: true
			}
		});

		return promise_bb.each(columnParams, function(item) {
			return queryInterface.addColumn('wells', item.columnName, item.columnDesc);
		}).then(() => {
            return promise_bb.each(queryParams, function(item) {
                return queryInterface.sequelize.query(item);
            });
        });  
    },

    down: function(queryInterface) {
		return false;
    }
};
