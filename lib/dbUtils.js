"use strict";

exports.findAllCustom = function(model, options) {
    options = options ? options : {};
    for( var associationName in model.associations ) {
        const association = model.associations[associationName];
        options.include = [{ model: association.target, as: association.as }];
    }
    return model.findAll(options);
}


function simplifyItem(model, item) {
    for( var associationName in model.associations ) {
        const association = model.associations[associationName];
        for( var att in association.target.attributes ) {
            if(att == 'id') continue;
            const fieldName = association.as + '_' + att;
            item.dataValues[fieldName] = item[association.as][att];
        }
    }
}


exports.simplifyArray = function(model, array) {
    for(var i = 0; i < array.length; i++) {
        simplifyItem( model, array[i] );
    }
}