import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Production: IBaseDataSourceParams = {
    fields: {
        oil_field_id: {
            label: 'Campo'
        },
        oil_field_name: {
            label: 'Campo'
        },
        oil_production: {
            label: 'Óleo (bbl/dia)'
        },
        oil_condensed_production: {
            label: 'Condensado (bbl/dia)'
        },
        gas_associated_production: {
            label: 'Gás natural associado'
        },
        gas_non_associated_production: {
            label: 'Gás natural não associado'
        },
        gas_royaties_volume: {
            label: 'Volume Gás Royalties (Mm³/dia)'
        },
        water_production: {
            label: 'Água (bbl/dia)'
        },
    },
    labelField: 'well_operator',
    gridFields: ['basin_name', 'well_operator', 'oil_production', 'gas_associated_production'],
    tableLabel: 'Produção',
    hasMap: false,
}

export = Production;