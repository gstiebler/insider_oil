'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('comercial_declarations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            block_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'blocks',
                    key: 'id'
                }
            },
            oil_field_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'oil_fields',
                    key: 'id'
                }
            },
            basin_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'basins',
                    key: 'id'
                }
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('comercial_declarations');
    }
};