
exports.findAllCustom = function(model, options) {
    options = options ? options : {};
    const models = model.modelManager.sequelize.models;
    for( associationName in model.associations ) {
        const association = model.associations[associationName];
        options.include = [{ model: association.target, as: association.as }];
    }
    return model.findAll(options);
}