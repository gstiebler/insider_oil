import { IRef } from '../../../common/Interfaces';

export interface IField {
    label: string;
    fieldName?: string;
    type?: string;
    ref?: IRef;
}
