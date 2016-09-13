"use strict";

import { ImportExcel } from './ImportExcelClass';

const jsonFields = [
    'Inscrição',
    'IMO',
    'REB',
    'TEU',
    'Capacidade de passageiros',
    'BHP',
    'Arqueação bruta',
    'Comprimento',
    'Calado',
    'IRIN',
    'Registro no tribunal marítimo',
    'Tipo de navegação',
    'TPB',
    'Ano de construção',
    'Qtde motores',
    'Situação',
    'Arqueação líquida',
    'Boca',
    'Natureza ou Tipo de Carga',
];

export class Boat extends ImportExcel {

    protected setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);

        const jsonObj = {};
        let foundField = false;
        for(let field of jsonFields) {
            let value = record[field];
            if(value) {
                jsonObj[field] = value;
                foundField = true;
            }
        }
        if(foundField) {
            record.info_json = jsonObj;
        }
    }
    
}