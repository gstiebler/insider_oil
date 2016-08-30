import { IBaseDataSourceParams } from '../../../common/Interfaces';

// Basin is usually redundant with Block. But it's importante because some
// Oil Fields doesn't have the reference to a Block
const OilField: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        basin_id: {
            label: "Bacia"
        },
        basin_name: {
            label: "Bacia"
        },
        state: {
            label: "Estado"
        },
        concessionaries: {
            label: "Concessionárias",
            isConcessionaries: true,
            isManyToMany: true,
            comboSource: 'Company'
        },
        concessionaries_props: {
            label: "Concessionárias % (admin)",
            isList: true
        },
        /* It's been shown with a custom formatter on record_view.html
        formatted_concessionaries: {
            label: "Concessionárias"
        },*/
        formatted_shore: {
            label: "Terra/Mar"
        },
        shore: {
            label: "ignorar"
        },
        stage: {
            label: "Estágio (admin)"
        },
        updates: {
            label: "Atualizações"
        },
        block_name: {
            label: "Bloco"
        },
        block_id: {
            label: "Bloco"
        },
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
        },
        polygons_admin: {
            label: "Polígonos (admin)",
            isTextArea: true
        },
    },
    labelField: "name",
    gridFields: ['name', 'basin_name', 'state', 'shore', 'stage'],
    tableLabel: "Campos",
    labelSingular: 'Campo',
    referencedObjectsOnView:  [
        {
            queryName: 'hydrocarbonEvidencesByOilField',
            title: 'Indícios de hidrocarbonetos'
        },
        {
            queryName: 'productionUnitByOilField',
            title: 'Unidades de produção'
        },
    ],
    excelParams: {
        keyField: "nome",
        fields: {
            'nome': 'name',
            'bacia': 'basin',
            'bloco': 'block',
            'estado': 'state',
            'concessionárias': 'concessionaries',
            'terra/mar': 'shore',
            'estágio': 'stage',
            'atualizações': 'updates',
        }
    },
};

export = OilField;