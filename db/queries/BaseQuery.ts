interface IRef {
    modelField: string;
    idField: string;
    valueField: string;
}

export interface IField {
    label: string;
    fieldName?: string;
    type?: string;
    ref?: IRef;
}
