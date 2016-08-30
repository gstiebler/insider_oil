import { IBaseDataSourceParams } from '../../../common/Interfaces';

const GasMovement: IBaseDataSourceParams = {
    fields: {
        product: {
            label: "Produto"
        },
        period_year: {
            label: "Ano"
        },
        period_month: {
            label: "Mês"
        },
        value: {
            label: 'Valor'
        },
        gas_pipeline_id: {
            label: 'Gasoduto',
        },
        gas_pipeline_name: {
            label: 'Gasoduto',
        },
    },
    labelField: "name",
    gridFields: ['gas_pipeline_name', "product", "period_year", 'period_month', 'value'],
    tableLabel: "Movimentação de gasoduto",
    labelSingular: 'Movimentação de gasoduto',
}

export = GasMovement;