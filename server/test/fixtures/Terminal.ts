'use strict';
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const Terminal:Sequelize.Model<any, any> = db.models.Terminal;
    const newRecordsData = [
        {
            name: 'Barueri',
            type: 'ONSHORE',
            address: 'Rodovia Presidente Castelo Branco km 19,5 - CEP 06463-400 - Jardim Mutinga - Barueri/SP',
            info: 'Produto: Derivados, álcool e biodiesel'
        },
        {
            name: 'Volta Redonda',
            type: 'ONSHORE',
            address: 'Av. Integração, 1829 - CEP 27293-100 - Vila Americana - Volta Redonda/RJ',
            info: 'Produto: Derivados, álcool e biodiesel'
        },
        {
            name: 'Angra dos Reis',
            type: 'OFFSHORE',
            address: 'Rodovia Governador Mário Covas km 471 - CEP 23.905-000 - Jacuecanga - Angra dos Reis/RJ',
            info: 'Produto: Petróleo, Derivados, álcool e biodiesel'
        }
    ];
    
    return Terminal.bulkCreate(newRecordsData);
}