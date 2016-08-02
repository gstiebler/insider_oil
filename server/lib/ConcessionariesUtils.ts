'use strict';

import * as Sequelize from 'sequelize';  
var await = require('./await');

export function updateConcessionaries(db, object) {
    const options = { where: { oil_field_id: object.id } };
    // remove all records from OilFieldConcessionary associated with this oil field
    return db.OilFieldConcessionary.destroy(options).then(function() {
        const concessionaries = object.dataValues.concessionaries;
        const concessionaries_props = object.dataValues.concessionaries_props;
        if (!concessionaries || !concessionaries_props)
            return null;
        if (concessionaries.length != concessionaries_props.length)
            throw 'Tamanhos diferentes de concessionários';
        const newConcessionariesRecords = [];
        var prop_sum = 0;
        for (var i = 0; i < concessionaries.length; i++) {
            const ofcRecord = {
                oil_field_id: object.id,
                company_id: concessionaries[i].id,
                prop: concessionaries_props[i] / 100.0
            };
            newConcessionariesRecords.push(ofcRecord);
            prop_sum += concessionaries_props[i] * 1.0;
        }
        if(Math.abs(prop_sum - 100.0) > 0.0001)
            throw 'Valores somam ' + prop_sum + '%';
        
        return db.OilFieldConcessionary.bulkCreate(newConcessionariesRecords);
    });
}

export function getConcessionaries(sequelize:Sequelize.Sequelize, id: number) {
    const select = 'select c.name, c.id, ofc.prop ';
    const fromStr = 'from oil_field_concessionaries ofc ';
    const companyJoin = ' left outer join companies c on ofc.company_id = c.id ';
    const where = 'where ofc.oil_field_id = ' + id;
    const order = ' order by ofc.id';
    const queryStr = select + fromStr + companyJoin+ where  + order;
    const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
    const result = await( sequelize.query(queryStr, simpleQueryType) );
    return result;
}

export function getConcessionariesProps(sequelize:Sequelize.Sequelize, id: number) {
    const select = 'select round(ofc.prop * 100, 2) as prop ';
    const fromStr = 'from oil_field_concessionaries ofc ';
    const where = 'where ofc.oil_field_id = ' + id;
    const order = ' order by ofc.id';
    const queryStr = select + fromStr + where + order;
    const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
    const result = await( sequelize.query(queryStr, simpleQueryType) );
    return result.map( value => { return value.prop } );    
}

export function getFormattedConcessionaries(sequelize:Sequelize.Sequelize, id: number) {
    const select = 'select c.name, round(ofc.prop * 100, 2) as percent ';
    const fromStr = 'from oil_field_concessionaries ofc '; 
    const companyJoin = ' left outer join companies c on ofc.company_id = c.id ';
    const where = 'where ofc.oil_field_id = ' + id;
    const order = ' order by ofc.id';
    const queryStr = select + fromStr + companyJoin+ where  + order;
    const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
    const result = await( sequelize.query(queryStr, simpleQueryType) );
    let concessionaries = ''; 
    for(let row of result) {
        concessionaries += row.name + ': ' + row.percent + '%\n';
    }
    return concessionaries.substr(0, concessionaries.length - 1);    
}