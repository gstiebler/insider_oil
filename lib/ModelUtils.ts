'use strict';
import Sequelize = require('sequelize');

export function getListFieldObj(textFieldName:string) {
    return {
        type: Sequelize.VIRTUAL,
        get: function() {
            return JSON.parse(this[textFieldName]);
        },
        set: function(newValue) {
            this[textFieldName] = JSON.stringify(newValue);
        }
    }
}