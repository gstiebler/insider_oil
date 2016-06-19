"use strict";

import { ImportExcel, IOkFunc, IExcelUploadResponse } from './ImportExcelClass';
import { BlockC } from './Block';
import { Production } from './Production';
import { Bid } from './Bid';

function execute(excelBuf, modelName: string):Promise<IExcelUploadResponse> {
    const excelClasses = {
        'Block': BlockC,
        'Production': Production,
        'Bid': Bid,
    };

    var excelClass = excelClasses[modelName];
    if(!excelClass)
        excelClass = ImportExcel;

    const importExcel:ImportExcel = new excelClass();
    return importExcel.execute(excelBuf, modelName);
}

export = execute;