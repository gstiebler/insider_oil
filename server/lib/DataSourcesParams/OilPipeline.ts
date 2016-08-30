import { IBaseDataSourceParams } from '../../../common/Interfaces';

const OilPipeline: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        diameter: {
            label: "Diâmetro (pol)"
        },
        extension: {
            label: "Extensão (km)"
        },
        src_state: {
            label: 'Estado de origem'
        },
        src_location_text: {
            label: 'Origem',
        },
        dst_state: {
            label: 'Estado de destino',
        },
        dst_location_text: {
            label: 'Destino',
        },
        products: {
            label: 'Produtos'
        },
        owner_preference: {
            label: 'Preferência do Proprietário'
        },
        start_date: {
            label: 'Vigência',
        },
        max_capacity: {
            label: 'Capacidade máxima',
        },
        op_capacity: {
            label: 'Capacidade operacional',
        },
        contract_capacity: {
            label: 'Capacidade contratada'
        },
        contract_released_capacity: {
            label: 'Capacidade contratada liberada'
        },
        contract_start_date: {
            label: 'Vigência contrato'
        },
    },
    labelField: "name",
    gridFields: ["name", 'extension', 'diameter', 'products', ],
    tableLabel: "Oleodutos",
    labelSingular: 'Oleoduto',
}

export = OilPipeline;