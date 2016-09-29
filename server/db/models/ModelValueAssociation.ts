'use strict';
import * as Sequelize from 'sequelize';

module.exports = function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const ModelValueAssocation = sequelize.define('ModelValueAssocation', 
        {
            model_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            obj_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            desc: {
                type: Sequelize.STRING,
                allowNull: false
            },
            value: {
                type: Sequelize.JSON,
                allowNull: true
            },
        },
        {
            underscored: true,
            tableName: 'model_value_associations',
            classMethods: {
                associate: function (models) {},
            },
        }
    );

    return ModelValueAssocation;
};