"use strict";

import { ImportExcel, IOkFunc } from './ImportExcelClass';
import { BlockC } from './Block';
   

export function execute(excelBuf, modelName: string, onOk?, onError?) {
    var importExcel:ImportExcel;
    if(modelName == 'Block') {
        importExcel = new BlockC();
    } else {
        importExcel = new ImportExcel()
    }
    importExcel.execute(excelBuf, modelName, onOk, onError);
}