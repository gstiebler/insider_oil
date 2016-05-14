module.exports = function(queryInterface) {
    return queryInterface.sequelize.models.ModelsList.bulkCreate([
        {
            name: 'AmbientalLicense'
        },
        {
            name: 'Basin'
        },
        {
            name: 'Block'
        },
        {
            name: 'ComercialDeclaration'
        },
        {
            name: 'Company'
        },
        {
            name: 'DrillingRigOffshore'
        },
        {
            name: 'DrillingRigOnshore'
        },
        {
            name: 'FixedUEPProduction'
        },
        {
            name: 'FPSOProduction'
        },
        {
            name: 'OilField'
        },
        {
            name: 'Person'
        },
        {
            name: 'Production'
        },
        {
            name: 'Reserve'
        },
        {
            name: 'Seismic'
        },
        {
            name: 'Well'
        },
        {
            name: 'ProductionUnit'
        },
        {
            name: 'Refinery'
        },
        {
            name: 'Terminal'
        },
    ]);
}