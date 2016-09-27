import db = require('../db/models');
import * as Sequelize from 'sequelize';

interface IAttributes {
    id: number;
    user: string;
    agent: string;
    path: string;
    query: string;
}

async function main() {
    const maxCount = 1000;
    let counter = 0;
    let reqModel:Sequelize.Model<any, IAttributes> = db.models.RequestLog;
    while(true) {
        try{
        let options:Sequelize.FindOptions = {
            limit: maxCount,
            offset: counter
        }

        let records = await reqModel.findAll(options);
        if(records.length == 0) break;

        for(let record of records) {
            try {
                JSON.parse(record.query);
            } catch(err) {
                record.query = "{}";
                await record.save();
            }
        }
        counter += maxCount;
        console.log(records[0]);
        } catch(err) {
            console.log(err);
        }
    }
}

main();
