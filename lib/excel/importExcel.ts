"use strict";

import { ImportExcel, IOkFunc, IExcelUploadResponse } from './ImportExcelClass';
import { BlockC } from './Block';
import { Production } from './Production';

function execute(excelBuf, modelName: string):Promise<IExcelUploadResponse> {
    var importExcel:ImportExcel;
    if(modelName == 'Block') {
        importExcel = new BlockC();
    } else if(modelName == 'Production') {
        importExcel = new Production();
    } else {
        importExcel = new ImportExcel()
    }
    
    return importExcel.execute(excelBuf, modelName);
}

export = execute;