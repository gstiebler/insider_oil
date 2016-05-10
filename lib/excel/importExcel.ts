"use strict";

import { ImportExcel, IOkFunc } from './ImportExcelClass';
import { BlockC } from './Block';
import { Production } from './Production';
   

function execute(excelBuf, modelName: string, onOk?, onError?) {
    var importExcel:ImportExcel;
    if(modelName == 'Block') {
        importExcel = new BlockC();
    } else if(modelName == 'Production') {
        importExcel = new Production();
    } else {
        importExcel = new ImportExcel()
    }
    importExcel.execute(excelBuf, modelName, onOk, onError);
}

export = execute;