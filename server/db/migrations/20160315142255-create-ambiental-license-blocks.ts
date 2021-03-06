'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('ambiental_license_blocks', {
            // TODO remove this field
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            ambiental_license_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ambiental_licenses',
                    key: 'id'
                }
            },
            block_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'blocks',
                    key: 'id'
                }
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then(function() {
            return queryInterface.addIndex(
                'ambiental_license_blocks',
                ['ambiental_license_id', 'block_id'],
                {
                    indexName: 'MainIndex',
                    indicesType: 'UNIQUE'
                }
            )
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('ambiental_license_blocks');
    }
};
