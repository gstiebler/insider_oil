"use strict";

import { ImportExcel, IOkFunc } from './ImportExcelClass';
import { BlockC } from './Block';
import { Production } from './Production';
   

function execute(excelBuf, modelName: string):Promise<any> {
    var importExcel:ImportExcel;
    if(modelName == 'Block') {
        importExcel = new BlockC();
    } else if(modelName == 'Production') {
        importExcel = new Production();
    } else {
        importExcel = new ImportExcel()
    }
    var p1 = new Promise(
        function(resolve, reject) {
            function onOk(status, invalidRecordsStatus) {
                resolve( { status: status, invalidRecordsStatus: invalidRecordsStatus });
            }
            
            function onError(err) {
                reject(err);
            }
            
            importExcel.execute(excelBuf, modelName, onOk, onError);
        }
    );
    return p1;
}

export = execute;