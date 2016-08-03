"use strict";

import { ImportExcel } from './ImportExcelClass';

export class BlockC extends ImportExcel {

    protected getLineOffset(worksheet):number {
        return 10;
    }
    
}