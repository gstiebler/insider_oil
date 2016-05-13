'use strict';
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const Refinery:Sequelize.Model<any, any> = db.models.Refinery;
    const newRecordsData = [
        {
            name: 'Abreu e Lima',
            address: 'Rodovia PE 60, Km 10 - Ipojuca - PE',
            telephones: ['(81) 3879-3934'],
            capacity: 230,
            info: 'Produtos: Diesel S-10, nafta, óleo combustível, coque, GLP (Gás liquefeito de petróleo)'
        },
        {
            name: 'Refinaria Duque de Caxias (Reduc)',
            address: 'Rodovia Washington Luiz, km 113,7 Campos Elíseos – Duque de Caxias - RJ',
            telephones: ['(21) 2677-2231', '(21) 2677-2746'],
            capacity: 239,
            info: 'Principais produtos: Óleo Diesel, gasolina, querosene de aviação (QAV), asfalto, nafta petroquímica, gases petroquímicos (etano, propano e propeno), parafinas, lubrificantes, GLP, coque, enxofre.'
        },
        {
            name: 'Refinaria Isaac Sabbá (Reman)',
            address: 'Rua Rio Quixito, 1, Vila Buriti - Distrito Industrial - Manaus - AM CEP: 69072-070',
            telephones: ['(92) 3616-4195', '(92) 3616-4344'],
            capacity: 46,
            info: 'Principais produtos: GLP, nafta petroquímica, gasolina, querosene de aviação, óleo diesel, óleos combustíveis, óleo leve para turbina elétrica, óleo para geração de energia, asfalto.'
        }
    ];
    
    return Refinery.bulkCreate(newRecordsData);
}