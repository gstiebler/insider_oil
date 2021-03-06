import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Well: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Poço"
        },
        name_operator: { // name defined by the Operator Company
            label: "Nome operador"
        },
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
        },
        basin_name: {
            label: "Bacia"
        },
        lat: {
            label: "Latitude"
        },
        lng: {
            label: "Longitude"
        },
        block_name: {
            label: "Bloco"
        },
        block_id: {
            label: "Bloco"
        },
        oil_field_name: {
            label: "Campo"
        },
        oil_field_id: {
            label: "Campo"
        },
        production_unit_name: {
            label: "Unidade de produção"
        },
        production_unit_id: {
            label: "Unidade de produção"
        },
        drilling_rig: {
            label: "Sonda"
        },
        drilling_rig_onshore_id: {
            label: "Sonda (admin)"
        },
        drilling_rig_offshore_id: {
            label: "sonda (admin)"
        },
        drilling_rig_uniname: {
            label: "Sonda"
        },
        type: {
            label: "Tipo"
        },
        category: {
            label: "Categoria"
        },
        reclassification: {
            label: "Reclassificação"
        },
        situation: {
            label: "Situação"
        },
        start: {
            label: "Início"
        },
        end: {
            label: "Término"
        },
        conclusion: {
            label: "Conclusão"
        },
        measured_depth: {
            label: "Profundidade medida"
        },
        depth: {
            label: "Profundidade"
        },
    },
    labelField: "name",
    gridFields: ["name", "operator_name"],
    tableLabel: "Poços",
    labelSingular: 'Poço',
    excelParams: {
        keyField: "poco",
        fields: {
            poco: 'name',
            operadora: 'operator',
            'nome operador': 'name_operator',
            bloco: 'block',
            latitude_dd: 'lat',
            longitude_dd: 'lng',
            'bacia': 'basin',
            'campo': 'oil_field',
            'unidade de produção': 'production_unit',
            'sonda': 'drilling_rig_uniname',
            'tipo': 'type',
            'categoria': 'category',
            'reclassificação': 'reclassification',
            'situação': 'situation',
            'início': 'start',
            'término': 'end',
            'conclusão': 'conclusion',
            'profundidade medida': 'measured_depth',
            'profundidade': 'depth',
        }
    }
}

export = Well;