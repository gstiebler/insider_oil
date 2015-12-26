"use strict";

function getAssociationOptions(model) {
    var includeOptions = [];
    for( var associationName in model.associations ) {
        const association = model.associations[associationName];
        includeOptions.push({ model: association.target, as: association.as });
    }
    return includeOptions;
}


exports.findAllCustom = function(model, options) {
    options = options ? options : {};
    options.include = getAssociationOptions(model);
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

exports.simplifyItem = simplifyItem;
exports.getAssociationOptions = getAssociationOptions;